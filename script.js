document.getElementById('cep').addEventListener('blur', function() {
    var cep = this.value.replace(/\D/g, '');
    if (cep !== "") {
      var validacep = /^[0-9]{8}$/;
      if(validacep.test(cep)) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (!("erro" in data)) {
              document.getElementById('cidade').value = data.localidade;
              document.getElementById('uf').value = data.uf;
              document.getElementById('endereco').value = data.logradouro;
            } else {
              alert("CEP não encontrado.");
            }
          })
          .catch(error => console.log('Erro ao buscar CEP:', error));
      } else {
        alert("Formato de CEP inválido.");
      }
    }
  });