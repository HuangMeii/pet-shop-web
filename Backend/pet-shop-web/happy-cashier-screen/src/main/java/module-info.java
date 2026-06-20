module com.sgu.happycashierscreen {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires net.synedra.validatorfx;
    requires org.kordamp.ikonli.javafx;
    requires org.kordamp.bootstrapfx.core;
    requires eu.hansolo.tilesfx;
    requires com.almasb.fxgl.all;
    requires java.net.http;
    requires static lombok;
    requires com.fasterxml.jackson.annotation;
    requires annotations;
    requires com.fasterxml.jackson.databind;
    requires com.fasterxml.jackson.datatype.jsr310;

    opens com.sgu.happycashierscreen to javafx.fxml;
    exports com.sgu.happycashierscreen;
    exports com.sgu.happycashierscreen.controllers;
    opens com.sgu.happycashierscreen.controllers to javafx.fxml;

    opens com.sgu.happycashierscreen.dto.request to com.fasterxml.jackson.databind;
    opens com.sgu.happycashierscreen.dto.response to com.fasterxml.jackson.databind;
}