import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import fs from 'fs/promises'
import ejs from 'ejs';


const app = new Hono()

let todos = [
  {
    id: 1,
    title: "Pivko",
    done: false
  },
  {
    id: 2,
    title: "Učite se",
    done: false
  }
];


app.get(async (c, next) => {
  console.log(c.req.method, c.req.url)
  await next()
})

app.get('/', async (c) => {
  const html = await ejs.renderFile('views/index.html', {
    name: 'Mikeš',
    todos,
  });
  return c.html(html);
})

app.post('/add-todo', async (c)=> {
  const body = await c.req.formData();

  const title = body.get('title');

  todos.push({
    id: todos.length + 1,
    title: title,
    done: false
  })
  return c.redirect('/');
  }
);

app.get('/remove-todo/:id', async (c) =>{
  const id = Number(c.req.param('id'));
  todos = todos.filter((todo) => todo.id !== id)
  return c.redirect('/')
})


app.get('/toggle-todo/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const todo = todos.find((todo) => todo.id === id)
  todo.done = !todo.done

  const referer = c.req.header('Referer')

  return c.redirect(referer || '/');
})

app.get(`/todo/:id`, async (c) => {
  const id = Number(c.req.param('id'));
  const selectedTodo = todos.find((todo) => todo.id === id);

  if (!selectedTodo){
    return c.notFound();
  }

  const html = await ejs.renderFile('views/todoDetail.html', {
    todo: selectedTodo
  });
  return c.html(html);
})

app.post('/rename-todo/:id', async (c)=> {
  const body = await c.req.formData();

  const newTitle = body.get('newTitle');
  const id = Number(c.req.param('id'));
  const todo = todos.find((todo) => todo.id === id);
  todo.title = newTitle;
  const referer = c.req.header('Referer')

  return c.redirect(referer || '/');
  }
);




app.get('/hello/:name', async (c) => {
  const name = c.req.param('name')
  return c.html(`<h1>Hello, ${name}</h1>`)
})

app.use( async (c) => {
  c.status(404)
  return c.html('<h1>Page not found!</h1>')
})


app.notFound(async (c) =>{
return c.html('<h1>Page not found!</h1>')
}
);

serve({
  fetch: app.fetch,
  port: 8000,
})
