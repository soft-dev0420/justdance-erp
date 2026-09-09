'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'pl' | 'es' | 'fr';

// Starting vocabulary: sidebar nav + universally-reused actions. Individual
// pages (Team, Services, Inventory, Tasks, Work Schedule, Clients,
// Dashboard, Settings, Permissions) still render hardcoded English strings —
// this establishes the pattern and covers what's visible everywhere, with
// per-page translation as a follow-up rather than one giant first pass.
export const translations = {
  en: {
    navTeam: 'Team',
    navServices: 'Services',
    navInventory: 'Inventory',
    navTasks: 'Tasks',
    navWorkSchedule: 'Work Schedule',
    navDashboard: 'Dashboard',
    navClients: 'Clients',
    navSettings: 'Settings',
    navPermissions: 'Roles & Permissions',
    navMain: 'Main',
    navSettingsGroup: 'Settings',
    signOut: 'Sign out',
    owner: 'Owner',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading…',
    language: 'Language',
  },
  pl: {
    navTeam: 'Zespół',
    navServices: 'Usługi',
    navInventory: 'Magazyn',
    navTasks: 'Zadania',
    navWorkSchedule: 'Grafik pracy',
    navDashboard: 'Panel',
    navClients: 'Klienci',
    navSettings: 'Ustawienia',
    navPermissions: 'Role i uprawnienia',
    navMain: 'Główne',
    navSettingsGroup: 'Ustawienia',
    signOut: 'Wyloguj się',
    owner: 'Właściciel',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    add: 'Dodaj',
    search: 'Szukaj',
    loading: 'Ładowanie…',
    language: 'Język',
  },
  es: {
    navTeam: 'Equipo',
    navServices: 'Servicios',
    navInventory: 'Inventario',
    navTasks: 'Tareas',
    navWorkSchedule: 'Horario de trabajo',
    navDashboard: 'Panel',
    navClients: 'Clientes',
    navSettings: 'Ajustes',
    navPermissions: 'Roles y permisos',
    navMain: 'Principal',
    navSettingsGroup: 'Ajustes',
    signOut: 'Cerrar sesión',
    owner: 'Propietario/a',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Añadir',
    search: 'Buscar',
    loading: 'Cargando…',
    language: 'Idioma',
  },
  fr: {
    navTeam: 'Équipe',
    navServices: 'Services',
    navInventory: 'Inventaire',
    navTasks: 'Tâches',
    navWorkSchedule: 'Planning',
    navDashboard: 'Tableau de bord',
    navClients: 'Clients',
    navSettings: 'Paramètres',
    navPermissions: 'Rôles et permissions',
    navMain: 'Principal',
    navSettingsGroup: 'Paramètres',
    signOut: 'Déconnexion',
    owner: 'Propriétaire',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    loading: 'Chargement…',
    language: 'Langue',
  },
} as const;

export type T = { [K in keyof (typeof translations)['en']]: string };

const LANGUAGE_STORAGE_KEY = 'justdance.erp.language';
const LANGS: Lang[] = ['en', 'pl', 'es', 'fr'];

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: T;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      // One-time restore from localStorage on mount (empty deps — this never
      // re-runs), not a reactive sync with changing state, so the lint
      // rule's cascading-render concern doesn't apply here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored && (LANGS as string[]).includes(stored)) setLangState(stored as Lang);
    } catch {
      // localStorage unavailable (private mode, SSR edge cases) — default 'en' stands.
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Same as above — selection still applies for this session via state.
    }
  };

  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
