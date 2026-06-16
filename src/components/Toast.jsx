export default function Toast({ mensagem, tipo, onClose }) {

    if (!mensagem) return null;

    return (
        <div
            className={`
                fixed bottom-5 right-5
                px-5 py-4
                rounded-xl
                shadow-xl
                text-white
                min-w-[300px]
                z-50
                animate-pulse
                ${tipo === "erro"
                    ? "bg-red-500"
                    : "bg-green-500"}
            `}
        >
            <div className="flex justify-between items-center gap-4">

                <span>{mensagem}</span>

                <button
                    onClick={onClose}
                    className="font-bold"
                >
                    ×
                </button>

            </div>
        </div>
    );
}