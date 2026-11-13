import { Toaster } from "sonner";

export default function Template(props: any) {
    return (
        <div>
            {/* Contenedor global de los toasts */}
            <Toaster position="top-right" richColors closeButton />
            
            {/* El resto de tu plantilla */}
            {props.children}
        </div>
    );
}