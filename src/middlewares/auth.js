export function isUser(req, res, next) {
    if (req.session?.user.email) {
        return next();
    }
    return res.status(401).render('error', { error: 'Error de autenticación!' });
}
  
export function isAdmin(req, res, next) {
    if (req.session?.isAdmin) {
        return next();
    }
    return res.status(403).render('error', { error: 'Error de autorización!' });
} 