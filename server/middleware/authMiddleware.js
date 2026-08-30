// authMiddleware.js — Owner: Developer 1 (Backend Core & Auth Lead)
// JWT verification + role-based authorization guards (FR-02, AC-01).
// Exports expected by other modules: protect (verifies JWT, attaches req.user),
// authorize(...roles) (rejects if req.user.role is not in the allowed list).
// TODO: implement using jsonwebtoken; read secret from process.env.JWT_SECRET.
