const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'email obrigatório';
  if (!EMAIL_PATTERN.test(trimmed)) return 'email inválido';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'senha obrigatória';
  if (value.length < 6) return 'mínimo 6 caracteres';
  return null;
}

export function validateName(value: string, label = 'nome'): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${label} obrigatório`;
  if (trimmed.length < 2) return `${label} muito curto`;
  return null;
}

export function validateMatch(a: string, b: string): string | null {
  if (!b) return 'confirme a senha';
  if (a !== b) return 'senhas não coincidem';
  return null;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  if (user.length <= 2) return `${user[0] ?? ''}*@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}
