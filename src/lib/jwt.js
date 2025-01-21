import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const signToken = async (payload) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secret);
};

export const verifyToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error('Error verifing token :', error);
        throw new Error('Unable to verify the token');
    }
};

export const verifyTokenInite = async (token) => {
  try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
  } catch (error) {
      console.error('Error verifing token :', error);
      throw new Error('Unable to verify the token');
  }
};

export const generateInviteLink = async (newinviteRequest, isSubContractor = false) => {
    try {
      // Create a token with the inviteId
      const token = await signToken({ 
        _id: newinviteRequest._id,});
      // Return the full signup link with the token
      if(isSubContractor){
        return `${process.env.NEXT_PUBLIC_API_URL}/invited/subcontractor?token=${token}`;
      }
      return `${process.env.NEXT_PUBLIC_API_URL}/invited?token=${token}`;
    } catch (error) {
      console.error('Error generating invite link:', error);
      throw new Error('Unable to generate invite link.');
    }
  };