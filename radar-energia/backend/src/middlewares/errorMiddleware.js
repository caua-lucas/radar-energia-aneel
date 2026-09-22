const errorMiddleware = (err, req, res, next) => {
  console.error("Erro no servidor:", err); //Isso imprime o erro no terminal do backend. 

  const statusCode = err.statusCode || 500; //Se o erro tiver um statusCode, use ele. Caso contrário, use 500.

  res.status(statusCode).json({
    sucesso: false,
    mensagem: err.message || "Erro interno do servidor.",
  });
};

export default errorMiddleware;