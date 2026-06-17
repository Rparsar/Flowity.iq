"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "¿Eliminar registro?",
  description = "Esta acción no se puede deshacer. El registro se eliminará permanentemente.",
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
          {itemName && (
            <p className="mt-3 text-sm font-medium text-foreground bg-muted px-3 py-2 rounded-md">
              {itemName}
            </p>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
