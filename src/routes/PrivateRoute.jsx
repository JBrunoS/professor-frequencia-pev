import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const idProfessor = localStorage.getItem('id_professor');

    if (!idProfessor) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
