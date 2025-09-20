import { rest } from 'msw';

const users = [
  { id: 1, name: 'Krewer', email: 'av.krewer@gmail.com', password: '06072025' }
];

let nextId = 2;

export const handlers = [
  rest.post('/api/auth/signup', async (req, res, ctx) => {
    const { name, email, password } = await req.json();
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res(ctx.status(409), ctx.json({ message: 'Email já cadastrado' }));
    }
    const user = { id: nextId++, name, email, password };
    users.push(user);
    // return fake token
    return res(ctx.status(201), ctx.json({ user: { id: user.id, name: user.name, email: user.email }, token: 'fake-jwt-' + user.id }));
  }),

  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res(ctx.status(401), ctx.json({ message: 'Credenciais inválidas' }));
    }
    return res(ctx.status(200), ctx.json({ user: { id: user.id, name: user.name, email: user.email }, token: 'fake-jwt-' + user.id }));
  }),

  rest.get('/api/resources', (req, res, ctx) => {
    const resources = [
      { id: 1, title: 'Guia rápido para familiares', type: 'PDF', url: '#' },
      { id: 2, title: 'Técnicas de comunicação', type: 'Artigo', url: '#' }
    ];
    return res(ctx.status(200), ctx.json(resources));
  }),

  rest.get('/api/community/posts', (req, res, ctx) => {
    const posts = [
      { id: 1, author: 'Ana', content: 'Alguém tem dicas para rotina matinal?' },
      { id: 2, author: 'Letícia', content: 'Jogo novo que ajuda comunicação' }
    ];
    return res(ctx.status(200), ctx.json(posts));
  })
];
