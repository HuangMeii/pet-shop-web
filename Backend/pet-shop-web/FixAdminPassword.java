import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Script to generate BCrypt hash for admin password.
 * Run: java -cp "spring-security-crypto-*.jar;." FixAdminPassword
 * Or just use the hash directly in SQL.
 */
public class FixAdminPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        
        // Admin password: Asdf1234!
        String adminHash = encoder.encode("Asdf1234!");
        System.out.println("Admin (Asdf1234!): " + adminHash);
        
        // Staff/User password: 123456
        String userHash = encoder.encode("123456");
        System.out.println("User (123456): " + userHash);
    }
}
