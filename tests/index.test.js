import test from 'ava'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { app, db } from '../src/app.js'
import { todosTable } from '../src/schema.js'
import { eq } from 'drizzle-orm'

test.before('migrate database', async () => {
  await migrate(db, { migrationsFolder: './drizzle' })
})

test('it shows proper title', async (t) => {
  const response = await app.request('/')
  const html = await response.text()

  t.assert(html.includes('<title>Todo seznam</title>'))
})

test('it shows todos', async (t) => {
  await db.insert(todosTable).values({
    title: 'Moje todočko',
    priority: 'medium',
    done: false,
  })

  const response = await app.request('/')
  const html = await response.text()

  t.assert(html.includes('Moje todočko'))
})

test('it allows creating todos', async (t) => {
  const formData = new FormData()
  formData.set('title', 'Testovací todočko')
  formData.set('priority', 'medium')

  const response = await app.request('/add-todo', {
    method: 'POST',
    body: formData,
  })

  // Ověřím že proběhl redirect
  t.is(response.status, 302)

  // Získám si lokaci kam mě redirect posílá
  const location = response.headers.get('location')

  // Udělám druhý request
  const response2 = await app.request(location, {
    method: 'GET',
  })

  const text = await response2.text()

  // Ověřím že todočko z formuláře se nachází v HTML
  t.assert(text.includes('Testovací todočko'))
})

test.serial('detailní smazání úkolu', async (t) => {
  // 1. VLOŽENÍ (INSERT)
  // Použijeme .returning(), aby nám DB okamžitě vrátila to, co vytvořila (včetně ID)
  const [inserted] = await db
    .insert(todosTable)
    .values({
      title: 'Úkol pro test smazání',
      priority: 'low',
      done: false,
    })
    .returning(); 

  // Teď v proměnné 'inserted' máme objekt: { id: 123, title: '...', ... }

  // 2. SMAZÁNÍ (DELETE)
  // Použijeme ID z toho objektu, který jsme právě vytvořili
  await db
    .delete(todosTable)
    .where(eq(todosTable.id, inserted.id));

  // 3. KONTROLA
  const response = await app.request('/');
  const html = await response.text();

  t.false(html.includes('Úkol pro test smazání'));
});