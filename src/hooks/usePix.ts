import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getPixConfig,
    savePixConfig,
    getPixTransactions,
    createPixTransaction,
    updatePixTransactionStatus,
    PixConfigApi,
    PixTransactionApi,
} from "@/lib/api";

export function usePix() {
    const queryClient = useQueryClient();

    const configQuery = useQuery({
        queryKey: ["pixConfig"],
        queryFn: getPixConfig,
    });

    const transactionsQuery = useQuery({
        queryKey: ["pixTransactions"],
        queryFn: getPixTransactions,
    });

    const saveConfigMutation = useMutation({
        mutationFn: (payload: { pixKey: string; receiverName?: string }) =>
            savePixConfig(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData<PixConfigApi>(["pixConfig"], updated);
        },
    });

    const createTransactionMutation = useMutation({
        mutationFn: (payload: { invitationId: string; amount: number }) =>
            createPixTransaction(payload),
        onSuccess: (newTx) => {
            queryClient.setQueryData<PixTransactionApi[]>(
                ["pixTransactions"],
                (prev = []) => [newTx, ...prev]
            );
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: "PENDENTE" | "CONFIRMADO";
        }) => updatePixTransactionStatus(id, status),
        onSuccess: (updated) => {
            queryClient.setQueryData<PixTransactionApi[]>(
                ["pixTransactions"],
                (prev = []) =>
                    prev.map((t) => (t.id === updated.id ? updated : t))
            );
        },
    });

    const pixConfig = configQuery.data ?? null;
    const transactions = transactionsQuery.data ?? [];

    const confirmedTotal = transactions
        .filter((t) => t.status === "CONFIRMADO")
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingTotal = transactions
        .filter((t) => t.status === "PENDENTE")
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        pixConfig,
        isLoadingConfig: configQuery.isLoading,
        transactions,
        isLoadingTransactions: transactionsQuery.isLoading,
        confirmedTotal,
        pendingTotal,
        saveConfig: (payload: { pixKey: string; receiverName?: string }) =>
            saveConfigMutation.mutateAsync(payload),
        createTransaction: (payload: { invitationId: string; amount: number }) =>
            createTransactionMutation.mutateAsync(payload),
        updateStatus: (id: string, status: "PENDENTE" | "CONFIRMADO") =>
            updateStatusMutation.mutateAsync({ id, status }),
    };
}
