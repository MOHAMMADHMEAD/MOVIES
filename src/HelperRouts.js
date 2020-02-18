
export default [
  {
    method: "GET",
    path: "/",
    handler: function (request, reply) {
      const response = {
        status: "OK",
        env: "dev",
      };

      return (response);
    }
  }

];
