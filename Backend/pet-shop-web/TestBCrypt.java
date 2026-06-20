import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String hash = encoder.encode("123456");
        System.out.println("Hash: " + hash);
        System.out.println("Matches: " + encoder.matches("123456", hash));
        
        // Test with the hash we generated from Python
        String pythonHash = "$2a$12$PORWkY9BqUDw2PFLk2GIw.Fs22kSjz.kxcy/seocct9ZqD0DA3Tm.";
        System.out.println("Python hash matches: " + encoder.matches("123456", pythonHash));
    }
}
