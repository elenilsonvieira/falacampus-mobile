export const statusLabel = {
    SOLVED:"Resolvido",
    NOT_SOLVED:"Pendente"
} as const
export type StatusKey = keyof typeof statusLabel;

export function getStatusLabel(status: StatusKey): string{
    return statusLabel[status];
}