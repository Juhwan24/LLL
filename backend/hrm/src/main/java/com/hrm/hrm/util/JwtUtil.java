package com.hrm.hrm.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "testSecretKey20230327testSecretKey20230327testSecretKey20250723123";
    private static final long EXPIRATION_MS = 60 * 60 * 1000; // 1시간

    public static String createToken(String email, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
} 
