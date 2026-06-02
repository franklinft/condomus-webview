export const mocks = {
  'get-visitors-count': async () => 42,

  'get-visitors-schedules': async () => ({
    success: true,
    data: [{
    id: '1',
    name: 'Entrega Uber Eats',
    time: '14:00',
    day: 'Hoje',
    icon: 'motorbike',
  },
  {
    id: '2',
    name: 'Amazon Hub',
    time: '16:00',
    day: 'Hoje',
    icon: 'truck',
  }]
})
};
