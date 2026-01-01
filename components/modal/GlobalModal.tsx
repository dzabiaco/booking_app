"use client";

import {useModal} from "@/context/ModalContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function GlobalModal() {
    const {isOpen, close, content} = useModal();

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>
            <DialogContent className="sm:max-w-md [&>button]:cursor-pointer max-h-[80vh]
      overflow-y-auto" >
                {content}
            </DialogContent>
        </Dialog>
    );
}