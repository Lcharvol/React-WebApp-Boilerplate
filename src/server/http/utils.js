export const getUrl = server =>
  `http://${server.address().address}:${server.address().port}`;
