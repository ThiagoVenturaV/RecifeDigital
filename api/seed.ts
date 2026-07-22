import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const INITIAL_COURSES = [
  {
    id: '1',
    title: 'Informática Básica para o Dia a Dia',
    category: 'Informática',
    level: 'Nível Básico',
    description: 'Aprenda os fundamentos do uso de computadores, Internet e pacote office essencial para o mercado de trabalho.',
    workloadHours: 40,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Introdução ao Computador',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Ligando e Conhecendo o Sistema',
            duration: '15 min',
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Aprenda a ligar, desligar e operar os periféricos básicos como mouse e teclado.',
            topicsCovered: ['Ligar e desligar', 'Uso do Mouse e Teclado', 'Área de Trabalho']
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Cidadania Digital & Segurança Online',
    category: 'Sociedade',
    level: 'Nível Básico',
    description: 'Entenda seus direitos e deveres na internet, segurança online e navegação segura em serviços públicos pelo smartphone.',
    workloadHours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Proteção de Dados Pessoais',
        lessons: [
          {
            id: 'l1',
            title: '1.1 Criando Senhas Fortes',
            duration: '20 min',
            completed: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Como criar e gerenciar senhas seguras sem esquecê-las.',
            topicsCovered: ['Autenticação em 2 etapas', 'Gerenciadores de Senha', 'Evitando Golpes Pix']
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Lógica de Programação & Pensamento Computacional',
    category: 'Programação',
    level: 'Nível Intermediário',
    description: 'Introdução aos conceitos fundamentais de algoritmos, estruturas de decisão, laços de repetição e pensamento computacional.',
    workloadHours: 60,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Algoritmos e Variáveis',
        lessons: [
          {
            id: 'l1',
            title: '1.1 O que é um Algoritmo?',
            duration: '25 min',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: 'Conceitos primordiais da lógica de programação.',
            topicsCovered: ['Definição de Algoritmo', 'Entrada e Saída', 'Variáveis e Tipos']
          }
        ]
      }
    ]
  }
];

function getDb() {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
  if (!url) return null;
  return neon(url);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getDb();

  if (!sql) {
    return res.status(500).json({
      success: false,
      message: 'NEON_DATABASE_URL environment variable is missing in Vercel settings.'
    });
  }

  try {
    // 1. Create Tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        level VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        workload_hours INT NOT NULL,
        thumbnail TEXT NOT NULL,
        course_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        course_id VARCHAR(100) NOT NULL,
        progress_percent INT DEFAULT 0,
        completed_lessons JSONB DEFAULT '[]'::jsonb,
        is_enrolled BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        course_id VARCHAR(100) NOT NULL,
        course_title VARCHAR(255) NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        issue_date VARCHAR(100) NOT NULL,
        workload_hours INT NOT NULL,
        grade NUMERIC(4, 2) NOT NULL,
        verification_code VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Seed Default User
    const hashFn = (bcrypt as any).hash || (bcrypt as any).default?.hash;
    let demoPassword = 'MTIzNDU2'; // base64 of 123456
    if (typeof hashFn === 'function') {
      demoPassword = await hashFn('123456', 10);
    }
    await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES ('user-demo-1', 'Thiago Ventura', 'thiago@recifedigital.pe.gov.br', ${demoPassword})
      ON CONFLICT (email) DO NOTHING
    `;

    // 3. Seed Courses
    for (const course of INITIAL_COURSES) {
      await sql`
        INSERT INTO courses (id, title, category, level, description, workload_hours, thumbnail, course_data)
        VALUES (${course.id}, ${course.title}, ${course.category}, ${course.level}, ${course.description}, ${course.workloadHours}, ${course.thumbnail}, ${JSON.stringify(course)})
        ON CONFLICT (id) DO UPDATE SET title = ${course.title}, description = ${course.description}
      `;
    }

    // 4. Seed Demo Certificate
    await sql`
      INSERT INTO certificates (id, user_id, course_id, course_title, student_name, issue_date, workload_hours, grade, verification_code)
      VALUES (
        'cert-1',
        'user-demo-1',
        'c-frontend',
        'Web Front-End para Iniciantes',
        'Thiago Ventura',
        '22 de julho de 2026',
        60,
        9.5,
        'RDFE-2024-9842X'
      )
      ON CONFLICT (id) DO NOTHING
    `;

    return res.status(200).json({
      success: true,
      message: 'NeonDB tables migrated and seeded successfully!',
      seededCourses: INITIAL_COURSES.length,
      demoUser: 'thiago@recifedigital.pe.gov.br'
    });
  } catch (error: any) {
    console.error('NeonDB Migration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run migration/seed on NeonDB',
      error: error.message
    });
  }
}
