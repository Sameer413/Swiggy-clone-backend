import jwtToken from 'jsonwebtoken'

const generateToken = (id: string) => {
    return jwtToken.sign({ id }, 'sfdsfdf', { expiresIn: '3d' });
}

export default generateToken;