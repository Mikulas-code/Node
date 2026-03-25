import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import fs from 'fs/promises'
import ejs from 'ejs';
import { drizzle } from "drizzle-orm/libsql"
import { todosTable } from './src/schema.js';
import { eq } from 'drizzle-orm';
// DATABAZE

const db = drizzle({
  connection: "file:db.sqlite",
  logger: true,
})





const app = new Hono()

app.get(async (c, next) => {
  console.log(c.req.method, c.req.url)
  await next()
})

app.get('/', async (c) => {

  const todos = await db.select().from(todosTable).all();
  const html = await ejs.renderFile('views/index.html', {
    name: 'Mikeš',
    todos,
  });
  return c.html(html);
})

app.post('/add-todo', async (c)=> {
  const body = await c.req.formData();

  const title = body.get('title');

  await db.insert(todosTable).values({
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

  const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

  await db.update(todosTable).set({
    done: !todo.done
  }).where(eq(todosTable.id, id));

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
