import React from 'react';

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Sobre o ConectaTEA</h1>
      <p className="mt-4">
        O ConectaTEA é uma startup educacional e de suporte social para Pessoas com TEA e seus familiares.      
        Oferecemos suporte, jogos, comunidade e recursos com foco em acessibilidade e inclusão.
      </p>

      <section className="mt-6">
        <h2 className="font-semibold">Equipe</h2>
        <ul className="mt-2 list-disc pl-6">
          <li>Isabelly Vitoria Ferreira Rodrigues</li>
          <li>Heloisa Lopes Targa</li>
          <li>Ana Carolina Takahashi da Silva Teles</li>
          <li>Letícia Aparecida Vieira Machado</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Nossa História</h2>
        <p className="mt-2">
          O ConectaTEA nasceu como um projeto desenvolvido por quatro alunas da 
          <strong> Etec Professor Edson Galvão</strong>. Isabelly, Heloisa, Ana Carolina 
          e Letícia decidiram unir seus conhecimentos e esforços para criar uma plataforma 
          que fosse além de um simples trabalho escolar: queríamos impactar positivamente a sociedade.
          Contou com a ajuda de coordenadores da escola e de um colega programador para dar o melhor desempenho.
        </p>
        <p className="mt-2">
          A escolha pelo tema TEA (Transtorno do Espectro Autista) surgiu da vontade de dar 
          visibilidade, apoio e acolhimento às pessoas com autismo e às suas famílias. 
          Reconhecemos a importância da inclusão e da acessibilidade, e acreditamos que a tecnologia 
          pode ser uma ponte para oferecer suporte, aprendizado e conexão.
        </p>
        <p className="mt-2">
          Assim, o ConectaTEA é fruto de dedicação, empatia e da crença de que juntos podemos 
          transformar a forma como a sociedade enxerga e acolhe a diversidade.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Entre em Contato</h2>
        <p className="mt-2">
          📧 Email: <a href="mailto:conectatea1909@gmail.com" className="text-blue-600 underline">conectatea1909@gmail.com</a>
        </p>
      </section>
    </main>
  );
}

