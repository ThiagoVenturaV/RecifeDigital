import type { Course, Certificate } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'inf-basica',
    title: 'Informática Básica',
    category: 'Informática',
    level: 'Nível Básico',
    description: 'Aprenda os fundamentos do uso de computadores, internet e pacote office essencial para o mercado de trabalho.',
    workloadHours: 40,
    thumbnail: '/informatica.jpg',
    progressPercent: 25,
    isEnrolled: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1: Introdução ao Computador e Sistema Operacional',
        lessons: [
          {
            id: 'les-1',
            title: '1. O que é um computador e Componentes Básicos',
            durationMinutes: 15,
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Nesta aula inicial, compreenda os componentes de hardware e software.',
            topicsCovered: ['Teclado e Mouse', 'CPU e Memória', 'Conceitos de Arquivos e Pastas'],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital',
            instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
          },
          {
            id: 'les-2',
            title: '2. Navegando no Windows e Organizando Arquivos',
            durationMinutes: 20,
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Aprenda a criar pastas, mover arquivos e utilizar atalhos essenciais.',
            topicsCovered: ['Explorador de Arquivos', 'Atalhos Ctrl+C e Ctrl+V', 'Lixeira e Backup'],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Módulo 2: Microsoft Office - Excel & Word',
        lessons: [
          {
            id: 'les-3',
            title: '1. Introdução ao Ambiente do Excel',
            durationMinutes: 12,
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Conheça as linhas, colunas, células e a faixa de opções do Excel.',
            topicsCovered: ['Navegação pelas abas (Ribbon)', 'Seleção de células', 'Barra de Fórmulas'],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital'
          },
          {
            id: 'les-4',
            title: '2. Criando sua primeira Planilha',
            durationMinutes: 18,
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Nesta aula, vamos explorar a interface principal da ferramenta, aprender a inserir dados básicos, formatar células e criar fórmulas simples de soma e subtração.',
            topicsCovered: [
              'Navegação pelas abas (Ribbon).',
              'Tipos de dados: Texto, Número, Moeda e Data.',
              'Função básica: SOMA() .',
              'Atalhos de teclado essenciais para produtividade.'
            ],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital',
            instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
            quickQuestions: [
              {
                id: 'qq-1',
                question: 'Qual é o símbolo utilizado para iniciar qualquer fórmula ou função matemática em uma célula?',
                type: 'multiple',
                options: [
                  { id: 'opt-1', text: 'Asterisco (*)' },
                  { id: 'opt-2', text: 'Sinal de Mais (+)' },
                  { id: 'opt-3', text: 'Sinal de Igual (=)' }
                ],
                correctAnswer: 'opt-3',
                explanation: 'No Microsoft Excel, todas as fórmulas e funções devem começar obrigatoriamente com o sinal de igual (=).'
              },
              {
                id: 'qq-2',
                question: 'Qual é o nome da barra onde você pode visualizar e editar o conteúdo da célula selecionada?',
                type: 'short',
                correctAnswer: 'Barra de Fórmulas',
                explanation: 'A Barra de Fórmulas fica localizada acima da planilha e exibe o conteúdo exato ou a fórmula inserida.'
              }
            ]
          },
          {
            id: 'les-5',
            title: '3. Fórmulas Condicionais',
            durationMinutes: 15,
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Entenda como utilizar a função SE() para automatizar validações.',
            topicsCovered: ['Função SE()', 'Operadores de comparação', 'Formatos condicionais'],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital'
          },
          {
            id: 'les-6',
            title: '4. Gráficos Básicos',
            durationMinutes: 22,
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Transforme tabelas em gráficos visuais de colunas e pizza.',
            topicsCovered: ['Inserção de Gráficos', 'Personalização de Títulos', 'Exportação'],
            instructorName: 'Profa. Mariana Silva',
            instructorRole: 'Especialista em Produtividade Digital'
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-inf',
      title: 'AVALIAÇÃO FINAL - Informática Básica',
      durationMinutes: 45,
      passPercentage: 70,
      questions: [
        {
          id: 'q1',
          question: 'No contexto do sistema operacional Windows, qual a principal utilidade do atalho de teclado "Ctrl + C" e "Ctrl + V", respectivamente?',
          options: [
            { id: 'q1-a', text: 'Copiar e Colar arquivos ou textos selecionados.' },
            { id: 'q1-b', text: 'Recortar e Colar arquivos ou textos selecionados.' },
            { id: 'q1-c', text: 'Desfazer a última ação e Refazer a última ação.' },
            { id: 'q1-d', text: 'Salvar o documento atual e Imprimir o documento.' }
          ],
          correctAnswer: 'q1-a'
        },
        {
          id: 'q2',
          question: 'No Microsoft Word, qual recurso é o mais adequado para garantir que o título de um novo capítulo sempre inicie no topo de uma nova página, independentemente do texto anterior?',
          options: [
            { id: 'q2-a', text: 'Pressionar a tecla "Enter" repetidas vezes até alcançar a próxima página.' },
            { id: 'q2-b', text: 'Inserir uma "Quebra de Página" (Ctrl + Enter).' },
            { id: 'q2-c', text: 'Aumentar o tamanho da fonte do parágrafo anterior.' },
            { id: 'q2-d', text: 'Alterar as margens do documento exclusivamente para aquela seção.' }
          ],
          correctAnswer: 'q2-b'
        },
        {
          id: 'q3',
          question: 'No Microsoft Excel, a fórmula `=SOMA(A1:A5)` executa qual operação aritmética?',
          options: [
            { id: 'q3-a', text: 'Multiplica os valores contidos apenas nas células A1 e A5.' },
            { id: 'q3-b', text: 'Soma os valores contidos apenas nas células A1 e A5.' },
            { id: 'q3-c', text: 'Soma todos os valores no intervalo contínuo da célula A1 até a célula A5.' },
            { id: 'q3-d', text: 'Calcula a média dos valores contidos no intervalo de A1 a A5.' }
          ],
          correctAnswer: 'q3-c'
        }
      ]
    }
  },
  {
    id: 'cid-digital',
    title: 'Cidadania Digital no Celular',
    category: 'Sociedade',
    level: 'Nível Básico',
    description: 'Entenda seus direitos e deveres na internet, segurança online e navegação segura em serviços públicos pelo smartphone.',
    workloadHours: 20,
    thumbnail: '/cidadania.jpg',
    progressPercent: 45,
    isEnrolled: true,
    modules: [
      {
        id: 'mod-cid-1',
        title: 'Módulo 1: Serviços Públicos do Recife na Palma da Mão',
        lessons: [
          {
            id: 'les-cid-1',
            title: '1. Acessando o Portal da Prefeitura do Recife e Conecta Recife',
            durationMinutes: 15,
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Saiba como solicitar serviços públicos e acompanhar protocolos.',
            topicsCovered: ['Conecta Recife', 'Agendamentos Digitais', 'Segurança da Conta Gov.br'],
            instructorName: 'Prof. Carlos Eduardo',
            instructorRole: 'Consultor de Inclusão Digital'
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-cid',
      title: 'AVALIAÇÃO FINAL - Cidadania Digital',
      durationMinutes: 30,
      passPercentage: 70,
      questions: []
    }
  },
  {
    id: 'log-programacao',
    title: 'Lógica de Programação',
    category: 'Programação',
    level: 'Nível Intermediário',
    description: 'Introdução aos conceitos fundamentais de algoritmos, estruturas de decisão, laços de repetição e pensamento computacional.',
    workloadHours: 60,
    thumbnail: '/logica.jpg',
    progressPercent: 0,
    isEnrolled: false,
    modules: [
      {
        id: 'mod-log-1',
        title: 'Módulo 1: Algoritmos e Variáveis',
        lessons: [
          {
            id: 'les-log-1',
            title: '1. O que é um Algoritmo?',
            durationMinutes: 25,
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Aprenda a estruturar o pensamento lógico em passos computacionais.',
            topicsCovered: ['Variáveis e Constantes', 'Tipos de Dados', 'Entrada e Saída'],
            instructorName: 'Prof. Henrique Moura',
            instructorRole: 'Docente CESAR School'
          }
        ]
      }
    ],
    finalExam: {
      id: 'exam-log',
      title: 'AVALIAÇÃO FINAL - Lógica de Programação',
      durationMinutes: 60,
      passPercentage: 70,
      questions: []
    }
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    courseId: 'frontend-avancado',
    courseTitle: 'Desenvolvimento Web Front-End Avançado',
    issueDate: '15 de Dezembro, 2024',
    workloadHours: 120,
    grade: 9.8,
    competencies: ['React', 'Tailwind', 'APIs', 'TypeScript'],
    verificationCode: 'RDFE-2024-9842X',
    studentName: 'Thiago Ventura'
  },
  {
    id: 'cert-2',
    courseId: 'inf-basica-old',
    courseTitle: 'Pacote Office e Produtividade',
    issueDate: '10 de Outubro, 2024',
    workloadHours: 40,
    grade: 10.0,
    competencies: ['Word', 'Excel', 'PowerPoint'],
    verificationCode: 'RDPO-2024-1102A',
    studentName: 'Thiago Ventura'
  },
  {
    id: 'cert-3',
    courseId: 'ui-ux-design',
    courseTitle: 'Introdução ao UI/UX Design',
    issueDate: '20 de Agosto, 2024',
    workloadHours: 60,
    grade: 9.5,
    competencies: ['Figma', 'Prototipagem', 'Design System'],
    verificationCode: 'RDUX-2024-7741C',
    studentName: 'Thiago Ventura'
  }
];
