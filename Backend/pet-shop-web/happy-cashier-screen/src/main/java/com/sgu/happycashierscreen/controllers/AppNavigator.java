package com.sgu.happycashierscreen.controllers;

import com.sgu.happycashierscreen.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class AppNavigator {
    private static Stage stage;

    public static void setStage(Stage primaryStage) {
        stage = primaryStage;
    }

    public static void showLogin() throws IOException {
        FXMLLoader loader = new FXMLLoader(Application.class.getResource("login-view.fxml"));
        Parent root = loader.load();
        Scene scene = new Scene(root, 450, 500);
        scene.getStylesheets().add(Application.class.getResource("styles.css").toExternalForm());
        stage.setScene(scene);
        stage.setTitle("Staff Login - Pet Shop");
        stage.setResizable(false);
    }

    public static void showCashier() throws IOException {
        java.net.URL fxmlUrl = Application.class.getResource("cashier-view.fxml");
        if (fxmlUrl == null) throw new IOException("Resource not found: cashier-view.fxml. Ensure src/main/resources/com/sgu/happycashierscreen/ is on classpath.");
        FXMLLoader loader = new FXMLLoader(fxmlUrl);
        Parent root = loader.load();
        Scene scene = new Scene(root, 1200, 700);
        java.net.URL cssUrl = Application.class.getResource("styles.css");
        if (cssUrl != null) scene.getStylesheets().add(cssUrl.toExternalForm());
        stage.setScene(scene);
        stage.setTitle("Pet Shop Staff Screen");
        stage.setResizable(true);
    }

    public static void showHistory() throws IOException {
        FXMLLoader loader = new FXMLLoader(Application.class.getResource("history-view.fxml"));
        Parent root = loader.load();
        Scene scene = new Scene(root, 1000, 650);
        scene.getStylesheets().add(Application.class.getResource("styles.css").toExternalForm());
        stage.setScene(scene);
        stage.setTitle("Sales History - Pet Shop");
        stage.setResizable(true);
    }
}
