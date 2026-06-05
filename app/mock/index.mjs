export const mocks = {
  '/visitors-count': async () => 42,

  '/v1/accounts': async () => ({
    success: true,
    data: [{
    id: '1',
    name: 'Entrega Uber Eats',
    time: '14:00',
    day: 'Hoje',
    type: 'visitor'
  },
  {
    id: '2',
    name: 'Amazon Hub',
    time: '16:00',
    day: 'Hoje',
    type: 'delivery'
  },
  {
    id: '3',
    name: 'Manutenção',
    time: '10:00',
    day: 'Hoje',
    type: 'service'
  }
]
})
};
