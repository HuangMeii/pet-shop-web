package com.sgu.happycashierscreen;

import com.sgu.happycashierscreen.controllers.AppNavigator;
import javafx.stage.Stage;

import java.io.IOException;

public class Application extends javafx.application.Application {
    @Override
    public void start(Stage stage) throws IOException {
        AppNavigator.setStage(stage);
        AppNavigator.showLogin();
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
