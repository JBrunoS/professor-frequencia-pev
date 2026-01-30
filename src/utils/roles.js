export const ADMIN_ROLES = ['Diretor(a)', 'Coordenador(a)', 'Comitê', 'Financeiro(a)', 'Presidente'];

export function isAdmin(funcao) {
    return ADMIN_ROLES.includes(funcao);
}
