package com.funcoders.happy_pet_shop.configuration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Converter
@Slf4j
public class JsonbConverter implements AttributeConverter<String, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        // Validate that it's valid JSON, then return as-is for PostgreSQL JSONB
        try {
            objectMapper.readTree(attribute);
            return attribute;
        } catch (JsonProcessingException e) {
            log.error("Invalid JSON for JSONB column: {}", e.getMessage());
            return "{}";
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return dbData;
    }
}
