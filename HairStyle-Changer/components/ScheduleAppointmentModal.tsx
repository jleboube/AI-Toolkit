import React from 'react';

interface ScheduleAppointmentModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Love the new look?</h2>
                <p className="text-gray-300 text-center mb-8">
                    Ready to make it real? Find a top-rated salon near you to schedule your next haircut.
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={onConfirm}
                        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        Yes, find salons!
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        No, thanks
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAppointmentModal;
