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

document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário

    // Aqui você pode adicionar a lógica para enviar o formulário via AJAX se necessário
    const formData = new FormData(form);
    const request = new XMLHttpRequest();
    request.open("POST", form.action);
    request.send(formData);

    // Exibir a mensagem de confirmação
    const modal = document.getElementById('confirmationMessage');
    const closeButtonX = document.querySelector('.close-button-x');
    const closeButtonOk = document.querySelector('.close-button');

    modal.style.display = 'block';

    // Adicionar eventos de clique para os botões de fechar
    closeButtonX.addEventListener('click', function() {
      modal.style.display = 'none';
      form.reset(); // Limpa o formulário após o fechamento da mensagem
    });

    closeButtonOk.addEventListener('click', function() {
      modal.style.display = 'none';
      form.reset(); // Limpa o formulário após o fechamento da mensagem
    });

    // Fechar a mensagem quando clicar fora dela
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        form.reset(); // Limpa o formulário após o fechamento da mensagem
      }
    });
  });
});
