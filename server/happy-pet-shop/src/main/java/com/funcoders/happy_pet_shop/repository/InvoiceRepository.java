package com.funcoders.happy_pet_shop.repository;

import com.funcoders.happy_pet_shop.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    @Query("SELECT i FROM Invoice i " +
           "JOIN FETCH i.customer c " +
           "JOIN FETCH c.user " +
           "LEFT JOIN FETCH i.staff s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH i.invoiceDetails " +
           "WHERE i.customer.id = :id")
    List<Invoice> findAllByCustomer_Id(@Param("id") UUID id);

    @Query("SELECT i FROM Invoice i " +
           "JOIN FETCH i.customer c " +
           "JOIN FETCH c.user " +
           "LEFT JOIN FETCH i.staff s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH i.invoiceDetails " +
           "WHERE i.staff.id = :id")
    List<Invoice> findAllByStaff_Id(@Param("id") UUID id);
}
