/// <reference types="cypress" />

context('Formulário de doação - Cenários adicionais', () => {
  beforeEach(() => {
    cy.visit('/form.html');
  });

  it('Deve exibir mensagem de erro para CEP inválido', () => {
    cy.get('input#cep').type('00000000').trigger('blur');
    cy.on('window:alert', (text) => {
      expect(text).to.contains('CEP não encontrado.');
    });
  });

  it('Deve permitir digitar endereço manualmente quando CEP não é informado', () => {
    cy.get('input#cidade').should('be.empty').type('São Paulo');
    cy.get('input#uf').should('be.empty').type('SP');
    cy.get('input#endereco').should('be.empty').type('Avenida Paulista');
  });

  it('Deve preencher o formulário, mas não enviar sem selecionar os campos obrigatórios', () => {
    cy.get('input#name').type('Nome Teste');
    cy.get('input#email').type('teste@exemplo.com');
    cy.get('input#phone').type('11999999999');
    cy.get('input#cep').type('01311000');

    cy.intercept('GET', 'https://viacep.com.br/ws/01311000/json/', {
      localidade: 'São Paulo',
      uf: 'SP',
      logradouro: 'Avenida Paulista'
    });

    cy.get('input#cep').trigger('blur'); 
    cy.get('input#cidade').should('have.value', 'São Paulo');
    cy.get('input#uf').should('have.value', 'SP');
    cy.get('input#endereco').should('have.value', 'Avenida Paulista');

    cy.get('input#numero').type('123');
    cy.get('input#agua-potavel').type('2');
    
    cy.get('input#ventilador').clear();
    cy.get('form').submit();
    
  });

  it('Deve permitir a correção de um CEP inválido e buscar novamente', () => {
    cy.get('input#cep').type('00000000').trigger('blur');
    cy.on('window:alert', (text) => {
      expect(text).to.contains('CEP não encontrado.');
    });

    cy.get('input#cep').clear().type('01311000').trigger('blur');

    cy.intercept('GET', 'https://viacep.com.br/ws/01311000/json/', {
      localidade: 'São Paulo',
      uf: 'SP',
      logradouro: 'Avenida Paulista'
    });

    cy.get('input#cep').trigger('blur'); 
    cy.get('input#cidade').should('have.value', 'São Paulo');
    cy.get('input#uf').should('have.value', 'SP');
    cy.get('input#endereco').should('have.value', 'Avenida Paulista');
  });

  it('Deve exibir mensagem de erro se o CEP tiver formato inválido', () => {
    cy.get('input#cep').type('abc12345').trigger('blur');
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Formato de CEP inválido.');
    });
  });

  it('Deve permitir a digitação manual dos campos de endereço e enviar o formulário corretamente', () => {
    cy.get('input#name').type('Nome Teste');
    cy.get('input#email').type('teste@exemplo.com');
    cy.get('input#phone').type('11999999999');
    cy.get('input#cep').clear();

    cy.get('input#cidade').type('São Paulo');
    cy.get('input#uf').type('SP');
    cy.get('input#endereco').type('Avenida Paulista');
    cy.get('input#numero').type('123');
    cy.get('input#agua-potavel').type('2');

    cy.get('form').submit();

    cy.get('#confirmationMessage').should('be.visible');
  });
});
