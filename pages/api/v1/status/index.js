function status(request, response) {
  response.status(200).json({ 'Status': 'API está funcionando!' });
}

export default status;