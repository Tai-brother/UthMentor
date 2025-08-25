package uth.edu.uthmentor.Service.ServiceImp;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private static final long EXPIRATION_TIME = 86400000;

    @Value("${jwtSecretString}")
    private String jwtSecretString;

    private SecretKey secretKey;

    @PostConstruct
    public void buildKey(){
        byte[] keyBytes = jwtSecretString.getBytes(StandardCharsets.UTF_8);
        this.secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(String userName){
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(userName)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload());
    }

    public String extractSubject(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token){
        return new Date().before(extractExpiration(token));
    }

    public Date extractExpiration(String token){
        return extractClaims(token, Claims::getExpiration);
    }

}
