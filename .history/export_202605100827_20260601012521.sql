INSERT INTO public.cart_items (id,quantity,cart_id,product_id) VALUES
	 ('a3e7372c-67d0-4fc0-9dc6-d880c3e7cfcf'::uuid,3,'597f4718-1c87-4b39-914d-600a8e508512'::uuid,'0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid),
	 ('900862e6-3356-49bd-8f0c-2fcfda254961'::uuid,1,'ceecbd89-3fb4-43ec-946a-6c7b7745b39b'::uuid,'0fee9909-5030-4653-89d9-ef00dcb62cec'::uuid),
	 ('6f94135c-4031-44c8-be76-d3c51b64d22d'::uuid,1,'ceecbd89-3fb4-43ec-946a-6c7b7745b39b'::uuid,'0b231149-7ee5-441c-bd6c-be71c74f8a30'::uuid);
INSERT INTO public.carts (id,created_at,updated_at,customer_id) VALUES
	 ('97b495ca-130e-4786-a57a-a49d61be0c44'::uuid,'2026-03-05 06:28:03.209121','2026-03-05 06:28:03.209121','ba5df993-5e43-4c10-9faf-6c0b63f1ead2'::uuid),
	 ('597f4718-1c87-4b39-914d-600a8e508512'::uuid,'2026-03-09 01:24:48.525024','2026-03-09 01:24:48.525024','0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid),
	 ('1f9cf106-9ebd-4922-ac0c-d03383aecea0'::uuid,'2026-03-10 12:03:13.68584','2026-03-10 12:03:13.68584','7a449c4f-3251-4282-974d-8ea2e0cce313'::uuid),
	 ('e6ff76dd-9625-4ad4-b030-3c4b9870e73c'::uuid,'2026-03-10 12:15:38.729196','2026-03-10 12:15:38.729196','5c61e765-bbb3-4860-ac4b-c3a0cd672d95'::uuid),
	 ('51945365-297e-441b-8c30-2d99634d3aa4'::uuid,'2026-03-10 12:19:11.24909','2026-03-10 12:19:11.24909','f1abd538-90a4-4774-8aca-494de63f132c'::uuid),
	 ('11dcb3d9-15f4-402c-ad7b-4e2142ad97b6'::uuid,'2026-03-21 22:58:06.659866','2026-03-21 22:58:06.659866','3cda06e7-1055-4da2-9864-5c392bee3c4c'::uuid),
	 ('ceecbd89-3fb4-43ec-946a-6c7b7745b39b'::uuid,'2026-03-21 23:10:42.236273','2026-03-21 23:10:42.236273','9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b'::uuid),
	 ('4bc4be2c-c851-4d4b-9278-387e4be893f2'::uuid,'2026-03-24 18:39:20.213681','2026-03-24 18:39:20.213681','62b0466e-1623-4b8e-ba4f-ea01f33e477b'::uuid),
	 ('1fabbb2d-462e-4f59-939d-e1a30ca4fe49'::uuid,'2026-03-27 00:57:45.797744','2026-03-27 00:57:45.806997','9454a904-6fb5-4298-9f12-8eb6e9740c1a'::uuid);
INSERT INTO public.categories (id,description,"name") VALUES
	 ('8fa2381a-b84e-44e3-9fe0-a4b8377bd210'::uuid,'Dry food, wet food, treats and supplements for pets','Food & Treats'),
	 ('5ac9671b-6fcb-49e0-93da-9951e15467e5'::uuid,'Toys and play items for dogs, cats and small animals','Toys'),
	 ('350e8854-0d84-45aa-9aa0-4d1c4aa21964'::uuid,'Collars, leashes, harnesses, bowls and travel gear','Accessories'),
	 ('60c77645-51ac-483a-9734-5d1c921ba397'::uuid,'Shampoos, brushes, nail clippers and grooming kits','Grooming'),
	 ('8196e945-2a4f-427d-bb57-41e29164f376'::uuid,'Vitamins, flea & tick control, and health care products','Health & Wellness'),
	 ('8853dc1f-fca0-44b4-98c5-3b72b958f3a5'::uuid,'Pet beds, crates, carriers and furniture','Beds & Furniture'),
	 ('5206051c-a497-46ba-856a-a84f55963cfc'::uuid,'Litter, litter boxes, waste bags and cleaning supplies','Litter & Hygiene'),
	 ('f4800e3a-3d23-4041-acaf-d72bc7f0f12a'::uuid,'Fish food, tanks, filters and aquarium supplies','Aquarium & Fish'),
	 ('8ff07c2b-c18c-475c-985b-f6fa4b4967f6'::uuid,'test','testCategory');
INSERT INTO public.customers (id,points,user_id) VALUES
	 ('ba5df993-5e43-4c10-9faf-6c0b63f1ead2'::uuid,0.00,'492fcb82-efc7-485f-ab49-fb5d45d37734'::uuid),
	 ('0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,6.00,'1816c561-2de1-4421-b3d8-007af8023cb9'::uuid),
	 ('7a449c4f-3251-4282-974d-8ea2e0cce313'::uuid,0.00,'8771f0ce-99d6-464c-8c02-0b48e99fc953'::uuid),
	 ('5c61e765-bbb3-4860-ac4b-c3a0cd672d95'::uuid,0.00,'38fdcb1b-cd5a-40ad-841a-094df8b4eb47'::uuid),
	 ('f1abd538-90a4-4774-8aca-494de63f132c'::uuid,0.00,'357f6ad8-0555-446a-8ef3-282ae864d37e'::uuid),
	 ('3cda06e7-1055-4da2-9864-5c392bee3c4c'::uuid,0.00,'aca96a40-d02d-4296-877b-e660c2f2b69f'::uuid),
	 ('9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b'::uuid,0.00,'baf5ae7d-7b2a-480a-8010-6225bb85f0b3'::uuid),
	 ('62b0466e-1623-4b8e-ba4f-ea01f33e477b'::uuid,0.00,'ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3'::uuid),
	 ('9454a904-6fb5-4298-9f12-8eb6e9740c1a'::uuid,0.00,'9ee96200-d65b-4b52-a70d-037c48958b60'::uuid);
INSERT INTO public.invalidated_token (id,expiry_time) VALUES
	 ('2167ebfb-b87f-4e44-9b13-971ff9fe7e6a','2026-03-11 03:47:23'),
	 ('c151c7c0-78a2-4d4c-8834-a0a8761bf290','2026-03-17 15:04:37'),
	 ('cef20b2c-ea35-401b-b5e7-4c009ca421dc','2026-03-21 12:59:58'),
	 ('60205e36-2361-4e1d-9a44-9fc9b150ccc2','2026-03-21 23:58:06');
INSERT INTO public.invoice_details (id,discount_amount,quantity,total_price,unit_price,invoice_id,pet_id,product_id,promotion_detail_id) VALUES
	 ('f0539e11-0c39-4a5f-8165-479e2b28ec66'::uuid,42750.00,1,285000.00,285000.00,'c92771fe-c572-4eb3-b754-68559abbcc77'::uuid,NULL,'57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,'3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9'::uuid),
	 ('bd3e2d0d-929c-47e5-8485-8227c0ffe102'::uuid,NULL,1,165000.00,165000.00,'3a99d162-9c19-41b9-bb21-27dcbc04af94'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('d8b7a514-03aa-4678-8c55-1bdb145be04a'::uuid,NULL,2,270000.00,135000.00,'3a99d162-9c19-41b9-bb21-27dcbc04af94'::uuid,NULL,'0fee9909-5030-4653-89d9-ef00dcb62cec'::uuid,NULL),
	 ('8f37bae3-2242-4c82-95ca-ea4d7c8c6d73'::uuid,NULL,1,111111.00,111111.00,'3a99d162-9c19-41b9-bb21-27dcbc04af94'::uuid,NULL,'0b231149-7ee5-441c-bd6c-be71c74f8a30'::uuid,NULL),
	 ('f6de7601-7c95-49a4-97c0-d8ee5e3622a5'::uuid,NULL,2,330000.00,165000.00,'e0d3a99f-0f29-40a0-b483-700bca01990c'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('1d289b0b-4ae8-481c-9952-2b67c1042488'::uuid,NULL,2,330000.00,165000.00,'763e65d0-283b-4fb1-91ae-7286188597f4'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('08031d7d-81f4-48fe-ae1b-a04cf92a755c'::uuid,NULL,1,111111.00,111111.00,'763e65d0-283b-4fb1-91ae-7286188597f4'::uuid,NULL,'0b231149-7ee5-441c-bd6c-be71c74f8a30'::uuid,NULL),
	 ('b3f6b1a6-fcff-4540-9b03-c64b1283c1c8'::uuid,NULL,2,330000.00,165000.00,'459ad6e4-6e55-492b-9aac-36b3f1384d01'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('952f9e8c-3074-4b49-a2bc-6b416d5c0b42'::uuid,140020.00,1,200000.00,200000.00,'26654a3d-0cf6-4991-a1f2-ad4dc916e9d9'::uuid,NULL,'29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,'8a879987-2914-40d3-960a-7e9961d240af'::uuid),
	 ('452e48dd-bc78-4667-aae8-f9d19446364a'::uuid,NULL,1,165000.00,165000.00,'f4393667-e770-4ec1-b5b6-397292440157'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL);
INSERT INTO public.invoice_details (id,discount_amount,quantity,total_price,unit_price,invoice_id,pet_id,product_id,promotion_detail_id) VALUES
	 ('2362205c-3b02-4bd6-b4d5-51cae46e0cb7'::uuid,140020.00,1,200000.00,200000.00,'8f7f5ef8-2a82-48c7-9dda-7b0abede8c5d'::uuid,NULL,'29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,'8a879987-2914-40d3-960a-7e9961d240af'::uuid),
	 ('2d6d9aac-e152-4032-9060-9a61e9f8745d'::uuid,NULL,1,165000.00,165000.00,'67bcfb0b-2a37-4f45-a41e-1915d958af64'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('96bb10d1-18f1-42da-a18c-6b09206bc4c0'::uuid,42750.00,1,285000.00,285000.00,'e33124bd-0582-4867-8d9e-aca2042889db'::uuid,NULL,'57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,'3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9'::uuid),
	 ('62ce6457-7f35-4f3c-90f0-9087117d4521'::uuid,42750.00,1,285000.00,285000.00,'349e2c7a-428b-49f0-98b2-fd1de7d0e5b2'::uuid,NULL,'57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,'3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9'::uuid),
	 ('1a382e99-6368-40d0-b848-781e0072b957'::uuid,NULL,1,165000.00,165000.00,'349e2c7a-428b-49f0-98b2-fd1de7d0e5b2'::uuid,NULL,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,NULL),
	 ('2ebcedc7-4aa7-43db-86cf-0f2c30adc273'::uuid,140020.00,1,200000.00,200000.00,'349e2c7a-428b-49f0-98b2-fd1de7d0e5b2'::uuid,NULL,'29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,'8a879987-2914-40d3-960a-7e9961d240af'::uuid),
	 ('dfd31891-0a9a-41ac-ba00-efbd33cb220f'::uuid,NULL,1,75000.00,75000.00,'0a1916d6-06da-42d7-9085-bcbbf1a0da9b'::uuid,NULL,'0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid,NULL),
	 ('9e505966-ce17-4752-bdc8-d7bfce232922'::uuid,NULL,3,225000.00,75000.00,'4f01d517-1e03-45ad-8d73-d0d23b2dcfde'::uuid,NULL,'0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid,NULL),
	 ('12919329-1a76-4cd7-9a3f-d6af6b760d83'::uuid,NULL,3,225000.00,75000.00,'9565cc12-5e71-43e5-8fdc-1dfb2ccba432'::uuid,NULL,'0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid,NULL);
INSERT INTO public.invoices (id,created_at,payment_method,real_amount,shipping_address,status,total_amount,customer_id,staff_id) VALUES
	 ('c92771fe-c572-4eb3-b754-68559abbcc77'::uuid,'2026-03-05 07:09:16.275423','QR_Scanning',242250.00,'25 Nguyen Trai, District 5, Ho Chi Minh City','PENDING',0.00,'ba5df993-5e43-4c10-9faf-6c0b63f1ead2'::uuid,'cfdc91f6-83ae-4d67-89b0-2453e60f2c59'::uuid),
	 ('e0d3a99f-0f29-40a0-b483-700bca01990c'::uuid,'2026-03-23 22:29:30.401897','COD',330000.00,'Ho Chi Minh city','PENDING',0.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('763e65d0-283b-4fb1-91ae-7286188597f4'::uuid,'2026-03-24 16:53:00.802951','COD',441111.00,'Ho Chi Minh city','PENDING',0.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('459ad6e4-6e55-492b-9aac-36b3f1384d01'::uuid,'2026-03-24 16:55:56.441789','COD',330000.00,'Ho Chi Minh city','PENDING',0.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('26654a3d-0cf6-4991-a1f2-ad4dc916e9d9'::uuid,'2026-03-24 18:37:30.988809','COD',59980.00,'Ho Chi Minh city','PENDING',0.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('f4393667-e770-4ec1-b5b6-397292440157'::uuid,'2026-03-27 09:09:24.096758','COD',165000.00,NULL,'PENDING',165000.00,'7a449c4f-3251-4282-974d-8ea2e0cce313'::uuid,'7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid),
	 ('8f7f5ef8-2a82-48c7-9dda-7b0abede8c5d'::uuid,'2026-03-27 09:14:25.73104','COD',59980.00,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','PENDING',200000.00,'9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b'::uuid,'7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid),
	 ('67bcfb0b-2a37-4f45-a41e-1915d958af64'::uuid,'2026-03-27 09:16:22.860882','COD',165000.00,'string','PENDING',165000.00,'f1abd538-90a4-4774-8aca-494de63f132c'::uuid,'7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid),
	 ('349e2c7a-428b-49f0-98b2-fd1de7d0e5b2'::uuid,'2026-03-27 09:22:56.558626','COD',467230.00,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','PENDING',650000.00,'9fe91ad5-8f7f-4aef-9eee-66a7c4f4905b'::uuid,'7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid),
	 ('3a99d162-9c19-41b9-bb21-27dcbc04af94'::uuid,'2026-03-23 18:15:35.998463','COD',546111.00,'dia chi giao hang moi','PAID',0.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL);
INSERT INTO public.invoices (id,created_at,payment_method,real_amount,shipping_address,status,total_amount,customer_id,staff_id) VALUES
	 ('e33124bd-0582-4867-8d9e-aca2042889db'::uuid,'2026-03-27 09:17:56.852356','COD',242250.00,'string','PAID',285000.00,'f1abd538-90a4-4774-8aca-494de63f132c'::uuid,'7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid),
	 ('0a1916d6-06da-42d7-9085-bcbbf1a0da9b'::uuid,'2026-05-08 03:03:30.175656','COD',75000.00,'Ho Chi Minh city','PENDING',75000.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('4f01d517-1e03-45ad-8d73-d0d23b2dcfde'::uuid,'2026-05-08 03:16:26.015475','COD',225000.00,'Ho Chi Minh city','PAID',225000.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL),
	 ('9565cc12-5e71-43e5-8fdc-1dfb2ccba432'::uuid,'2026-05-08 04:09:41.83653','COD',225000.00,'Ho Chi Minh city','PAID',225000.00,'0cf0c9a3-3410-492a-802c-4efe708fd478'::uuid,NULL);
INSERT INTO public.pets (id,available,breed,created_at,gender,"name",price,sold,species,updated_at,vaccinated,birth,image_url) VALUES
	 ('761192c2-3c73-417f-8969-9e08adb308db'::uuid,true,'Poodle','2026-03-06 10:41:27.614382','Male','Milo',4500000.00,false,'Dog','2026-03-06 10:41:27.614382',true,'2023-08-12','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png'),
	 ('49fd5894-31fe-4065-a832-981c53a29150'::uuid,true,'British Shorthair','2026-03-06 10:41:44.104497','Female','Luna',7000000.00,false,'Cat','2026-03-06 10:41:44.104497',true,'2024-01-05','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png'),
	 ('51c3e164-40bc-4686-8495-962b2c9072a7'::uuid,true,'Mini Lop','2026-03-06 10:41:51.886186','Female','Snowy',900000.00,false,'Rabbit','2026-03-06 10:41:51.886186',false,'2024-06-18','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png'),
	 ('268597cc-5fd4-47f3-a540-57768b482bc5'::uuid,true,'Clownfish','2026-03-06 10:41:55.97797','Male','Nemo',150000.00,false,'Fish','2026-03-06 10:41:55.97797',false,'2025-03-10','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png'),
	 ('fafbeff5-28cf-472b-bea5-e0693845a281'::uuid,true,'Syrian Hamster','2026-03-06 10:42:00.442633','Male','Cookie',120000.00,false,'Hamster','2026-03-06 10:42:00.442633',false,'2025-07-21','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png'),
	 ('f14c6692-9787-4721-824f-b066ce46b22c'::uuid,true,'Asia','2026-03-23 18:20:39.453841','Đực','Nguyen Hai Dang',12000.00,false,'Humanity','2026-03-23 18:29:21.276573',true,'2005-07-11','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774290558/jwzzrttxtdwyqnfrzxwz.png');
INSERT INTO public.products (id,available,brand,created_at,description,image_url,"name",origin,price,quantity,unit,updated_at,category_id,expiry_date) VALUES
	 ('c3aaf119-9794-4891-a80b-680cf14b658e'::uuid,true,'Royal Canin','2026-03-04 19:23:19.327568','Dry food for small breed adult dogs (1-10kg), supports digestion and coat health.','https://example.com/images/royal-canin-mini-adult-2kg.jpg','Royal Canin Mini Adult 2kg','France',285000.00,50,'KG',NULL,'8fa2381a-b84e-44e3-9fe0-a4b8377bd210'::uuid,NULL),
	 ('29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,true,'china','2026-03-24 16:58:03.018043','dien thoai cho cho','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1774371478/lydci47lq2n3sudyjo4d.png','dien thoai cho cho','china',200000.00,11308,'BOX','2026-03-27 09:22:56.564885','5ac9671b-6fcb-49e0-93da-9951e15467e5'::uuid,NULL),
	 ('96933adb-6487-4899-8872-da4e7cec6c05'::uuid,true,'Catsan','2026-03-04 19:23:39.367907','Clumping cat litter with lavender scent, strong odor control.','https://res.cloudinary.com/dx8hyzdgo/image/upload/v1773047013/vfxxtauixyhmifv1vube.jpg','Lavender Clumping Cat Litter 10L','Germany',165000.00,123173,'KG','2026-03-27 09:22:56.565414','5206051c-a497-46ba-856a-a84f55963cfc'::uuid,NULL),
	 ('0fee9909-5030-4653-89d9-ef00dcb62cec'::uuid,true,'Whiskas','2026-03-04 19:23:27.089305','Dry food with tuna flavor for adult cats over 1 year old.','https://example.com/images/whiskas-tuna-1-2kg.jpg','Whiskas Adult Tuna 1.2kg','Thailand',135000.00,78,'KG','2026-03-23 18:15:36.030239','8fa2381a-b84e-44e3-9fe0-a4b8377bd210'::uuid,NULL),
	 ('57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,true,'Royal Canin','2026-03-04 19:21:15.355216','Thức ăn hạt cao cấp dành cho chó trưởng thành giống nhỏ (1-10kg), hỗ trợ tiêu hóa và lông bóng mượt.','https://example.com/images/royal-canin-mini-adult-2kg.jpg','Royal Canin Mini Adult 2kg','France',285000.00,283047,'G','2026-03-27 09:22:56.565414','8fa2381a-b84e-44e3-9fe0-a4b8377bd210'::uuid,NULL),
	 ('0b231149-7ee5-441c-bd6c-be71c74f8a30'::uuid,true,'china','2026-03-08 08:01:31.307346','test','https://goofytails.com/cdn/shop/collections/dog-toy.jpg?v=1678779839','Test product','china',111111.00,109,'BOX','2026-03-24 16:53:00.872574','5ac9671b-6fcb-49e0-93da-9951e15467e5'::uuid,NULL),
	 ('0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid,true,'PetFun','2026-03-04 19:23:33.368042','Durable rubber bone toy for medium and large dogs.','https://example.com/images/rubber-bone-toy.jpg','Rubber Bone Dog Toy11','Vietnam',75000.00,93,'PHAN','2026-05-08 04:09:41.868943','8fa2381a-b84e-44e3-9fe0-a4b8377bd210'::uuid,NULL);
INSERT INTO public.promotion_details (id,product_id,promotion_id) VALUES
	 ('3cc0a4d2-5662-44d0-a736-c9f3aaffc2f9'::uuid,'57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,'823fcf04-8249-484f-bf05-39a0c39babb8'::uuid),
	 ('a32f0a76-697d-4218-aee2-eef7df2b996c'::uuid,'c3aaf119-9794-4891-a80b-680cf14b658e'::uuid,'823fcf04-8249-484f-bf05-39a0c39babb8'::uuid),
	 ('88910f5b-b207-42ed-9ba6-9840bf2d0d50'::uuid,'0fee9909-5030-4653-89d9-ef00dcb62cec'::uuid,'3776605f-8862-43c0-bf40-d571cbd3ea03'::uuid),
	 ('19dc20f9-22c8-4f41-b606-ffb07f54547f'::uuid,'0efbf7b4-fe1b-4564-885e-25d05cdcfed8'::uuid,'80cc7a85-9c5d-4edf-ba67-d5a7f40efeda'::uuid),
	 ('5565c8aa-8d46-4696-88a8-475bee2751a0'::uuid,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,'521467db-f0be-46a8-a67f-3370d1bd83a8'::uuid),
	 ('8a879987-2914-40d3-960a-7e9961d240af'::uuid,'29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,'202a16e7-617c-4697-89c0-148f7b3216ef'::uuid);
INSERT INTO public.promotions (id,code,created_at,description,discount_type,discount_value,end_date,max_discount_value,start_date,status,updated_at) VALUES
	 ('823fcf04-8249-484f-bf05-39a0c39babb8'::uuid,'RC15','2026-03-04 19:27:52.952885','Giảm 15% cho Royal Canin Mini Adult','PERCENT',15.00,'2026-03-31',50000.00,'2026-03-05','ACTIVE','2026-03-04 19:27:52.952885'),
	 ('3776605f-8862-43c0-bf40-d571cbd3ea03'::uuid,'WHISKAS10','2026-03-04 19:28:03.283392','Giảm 10% cho thức ăn mèo Whiskas','PERCENT',10.00,'2026-03-20',30000.00,'2026-03-05','ACTIVE','2026-03-04 19:28:03.283392'),
	 ('80cc7a85-9c5d-4edf-ba67-d5a7f40efeda'::uuid,'TOY20K','2026-03-04 19:28:10.575953','Giảm trực tiếp 20.000đ cho đồ chơi thú cưng','FIXED',20000.00,'2026-03-25',20000.00,'2026-03-05','ACTIVE','2026-03-04 19:28:10.575953'),
	 ('521467db-f0be-46a8-a67f-3370d1bd83a8'::uuid,'LITTER25','2026-03-04 19:28:17.161632','Flash Sale giảm 25% cát vệ sinh Lavender','PERCENT',25.00,'2026-03-10',60000.00,'2026-03-05','ACTIVE','2026-03-04 19:28:17.161632'),
	 ('202a16e7-617c-4697-89c0-148f7b3216ef'::uuid,'asdfasdf','2026-03-24 17:46:44.278318','giam sap sang','PERCENT',70.01,'2027-04-24',300000.01,'2025-06-01','ACTIVE','2026-03-24 17:46:44.278318');
INSERT INTO public.purchase_details (id,quantity,total_price,unit_price,product_id,purchase_id) VALUES
	 ('1f4161d2-b8cd-4512-ab08-16085618a882'::uuid,283000,28300000.00,100.00,'57752647-1d1f-4914-8bd4-12d994c09bb5'::uuid,'ffa848ca-c2df-4671-abdc-7662c419733f'::uuid),
	 ('2e2e8b3f-63df-4096-9c8e-303bf19257f8'::uuid,123123,15159273129.00,123123.00,'96933adb-6487-4899-8872-da4e7cec6c05'::uuid,'dd030e05-c290-4e51-a151-9e8e644b17ff'::uuid),
	 ('42b2bad8-e7ac-46ce-a7cf-6dd8cda3c1b7'::uuid,200,40000000.00,200000.00,'29cb5511-7db7-43c5-8ae3-550f362c57f6'::uuid,'9dd6c797-55a9-4124-9547-6b40ba86c33c'::uuid);
INSERT INTO public.purchases (id,created_at,status,total_amount,staff_id,supplier_id) VALUES
	 ('ffa848ca-c2df-4671-abdc-7662c419733f'::uuid,'2026-03-05 06:38:05.614306','PENDING',28300000.00,'cfdc91f6-83ae-4d67-89b0-2453e60f2c59'::uuid,'8ad7061c-081c-48a6-bb29-cfd762323e1b'::uuid),
	 ('dd030e05-c290-4e51-a151-9e8e644b17ff'::uuid,'2026-03-24 17:13:25.392076','PENDING',15159273129.00,'b6445ab3-970a-4dbe-ac64-487ed698b852'::uuid,'8ad7061c-081c-48a6-bb29-cfd762323e1b'::uuid),
	 ('9dd6c797-55a9-4124-9547-6b40ba86c33c'::uuid,'2026-03-24 17:19:13.934688','PENDING',40000000.00,'88045899-3d9f-453f-a185-0478ebe0a432'::uuid,'8ad7061c-081c-48a6-bb29-cfd762323e1b'::uuid);
INSERT INTO public.roles (role_name,description) VALUES
	 ('USER','Customers'),
	 ('STAFF','Staffs'),
	 ('ADMIN','Administrator');
INSERT INTO public.staffs (id,shift,user_id) VALUES
	 ('88045899-3d9f-453f-a185-0478ebe0a432'::uuid,3,'6998e255-c20a-4d4a-bc33-b4f2aefe738c'::uuid),
	 ('3dccc516-cf7b-4319-92c4-8f14abec427b'::uuid,3,'c7da6b04-c5d9-4170-850d-ed34ae26a739'::uuid),
	 ('b6445ab3-970a-4dbe-ac64-487ed698b852'::uuid,1,'a2052e0c-2a09-4b77-b1c8-28c16881db62'::uuid),
	 ('cfdc91f6-83ae-4d67-89b0-2453e60f2c59'::uuid,3,'36b2d0fd-dfa8-4619-a993-67f2655cfd56'::uuid),
	 ('2de8aaff-b942-46c5-b9f2-81cb56fbb79c'::uuid,1,'ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3'::uuid),
	 ('7bcc2326-d73d-467f-808c-0b2f05ed5b9b'::uuid,1,'9ee96200-d65b-4b52-a70d-037c48958b60'::uuid);
INSERT INTO public.suppliers (id,address,created_at,email,"name",phone,status,updated_at) VALUES
	 ('8ad7061c-081c-48a6-bb29-cfd762323e1b'::uuid,'120 Nguyen Thi Minh Khai, District 3, Ho Chi Minh City','2026-03-05 06:29:13.332221','contact@petfoodvn.com','Pet Food Vietnam Co., Ltd','0498765432','ACTIVATED','2026-03-05 06:29:13.332221'),
	 ('b7108eed-10c6-440e-a6c0-0756c67f2f0d'::uuid,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','2026-03-09 08:26:04.892329','trandinhkhanhdu2005@gmail.com','Dư Trần','0916114531','ACTIVATED','2026-03-09 08:26:04.892329');
INSERT INTO public.user_roles (user_id,role_id) VALUES
	 ('028e57b3-aa0b-40d5-b3e1-76c81f850fb8'::uuid,'ADMIN'),
	 ('36b2d0fd-dfa8-4619-a993-67f2655cfd56'::uuid,'STAFF'),
	 ('6998e255-c20a-4d4a-bc33-b4f2aefe738c'::uuid,'STAFF'),
	 ('c7da6b04-c5d9-4170-850d-ed34ae26a739'::uuid,'STAFF'),
	 ('492fcb82-efc7-485f-ab49-fb5d45d37734'::uuid,'USER'),
	 ('a2052e0c-2a09-4b77-b1c8-28c16881db62'::uuid,'STAFF'),
	 ('1816c561-2de1-4421-b3d8-007af8023cb9'::uuid,'USER'),
	 ('8771f0ce-99d6-464c-8c02-0b48e99fc953'::uuid,'USER'),
	 ('38fdcb1b-cd5a-40ad-841a-094df8b4eb47'::uuid,'USER'),
	 ('357f6ad8-0555-446a-8ef3-282ae864d37e'::uuid,'USER');
INSERT INTO public.user_roles (user_id,role_id) VALUES
	 ('aca96a40-d02d-4296-877b-e660c2f2b69f'::uuid,'USER'),
	 ('baf5ae7d-7b2a-480a-8010-6225bb85f0b3'::uuid,'USER'),
	 ('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3'::uuid,'USER'),
	 ('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3'::uuid,'STAFF'),
	 ('9ee96200-d65b-4b52-a70d-037c48958b60'::uuid,'STAFF'),
	 ('9ee96200-d65b-4b52-a70d-037c48958b60'::uuid,'USER');
INSERT INTO public.users (id,address,created_at,email,first_name,last_name,"password",phone,status,updated_at,username) VALUES
	 ('9ee96200-d65b-4b52-a70d-037c48958b60'::uuid,'dia chi nhan vien','2026-03-27 00:57:45.751355','trandinhkhanhdu222@gmail.com','Du','Tran','$2a$12$IP.wYsr7a0ly5hrRqGAu8eKjF9uD4asi1iC.BslS4nETi5OWcho0.','0999999999','ACTIVATED','2026-03-27 00:57:45.751355','0999999999'),
	 ('028e57b3-aa0b-40d5-b3e1-76c81f850fb8'::uuid,NULL,'2026-03-04 18:53:26.192806',NULL,NULL,NULL,'$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0911111111','ACTIVATED','2026-03-04 18:53:26.192806','admin'),
	 ('6998e255-c20a-4d4a-bc33-b4f2aefe738c'::uuid,'45 Nguyen Hue, District 1, Ho Chi Minh City','2026-03-05 06:23:12.21264','tran.minh@petshop.com','Tran','Minh','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0912345678','ACTIVATED','2026-03-05 06:23:12.21264','0912345678'),
	 ('c7da6b04-c5d9-4170-850d-ed34ae26a739'::uuid,'45 Nguyen Hue, District 1, Ho Chi Minh City','2026-03-05 06:24:32.411509','nhanvien@gmail.com','Tran','Minh','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0912345679','ACTIVATED','2026-03-05 06:24:32.411509','0912345679'),
	 ('a2052e0c-2a09-4b77-b1c8-28c16881db62'::uuid,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','2026-03-09 00:20:23.204943','trandinhkhanhdu2005@gmail.com','Dư','Trần','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0916114536','ACTIVATED','2026-03-09 00:20:23.204943','0916114536'),
	 ('36b2d0fd-dfa8-4619-a993-67f2655cfd56'::uuid,'123 Le Loi, District 1, Ho Chi Minh City','2026-03-05 06:16:11.749093','nguyen.an@petshop.com','Nguyen','Test','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0901234567','ACTIVATED','2026-03-09 01:17:55.898769','0901234567'),
	 ('492fcb82-efc7-485f-ab49-fb5d45d37734'::uuid,'25 Nguyen Trai, District 5, Ho Chi Minh City','2026-03-05 06:28:03.209121','tranduc@example1.com','Tran','Du','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0901234565','ACTIVATED','2026-03-09 07:59:01.030687','0901234565'),
	 ('8771f0ce-99d6-464c-8c02-0b48e99fc953'::uuid,'trandinhkhanhdu2005@gmail.com','2026-03-10 12:03:13.684661','string','Du','Tran','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0911111111','ACTIVATED','2026-03-10 12:03:13.684661','0911111111'),
	 ('38fdcb1b-cd5a-40ad-841a-094df8b4eb47'::uuid,'string','2026-03-10 12:15:38.703543','trandinhkhanhdu2000@gmail.com','Du','Tran','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0161304968','ACTIVATED','2026-03-10 12:15:38.703543','0161304968'),
	 ('357f6ad8-0555-446a-8ef3-282ae864d37e'::uuid,'string','2026-03-10 12:19:11.24909','trandinhkhanhdu2001@gmail.com','Du','Tran','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0161304961','ACTIVATED','2026-03-10 12:19:11.24909','0161304961');
INSERT INTO public.users (id,address,created_at,email,first_name,last_name,"password",phone,status,updated_at,username) VALUES
	 ('1816c561-2de1-4421-b3d8-007af8023cb9'::uuid,'Ho Chi Minh city','2026-03-09 01:24:48.412381','customer123@gmail.com','Tran','Test123','$2a$12$2gZE21GxNr9ON/JWnGxVCenjGh1U7DWVGUU7e8qxvYTfUo1VzTGlu','0916114537','ACTIVATED','2026-03-11 03:52:42.597466','0916114537'),
	 ('aca96a40-d02d-4296-877b-e660c2f2b69f'::uuid,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','2026-03-21 22:58:06.657848','trandinhkhanhdu1@gmail.com',NULL,NULL,'$2a$12$EnrVnD9bC7p0CtDeWUAIOuRLiMhroCjUORepmmd0jdIrbXlP0wUkC','0933333333','ACTIVATED','2026-03-21 22:58:06.657848','0933333333'),
	 ('baf5ae7d-7b2a-480a-8010-6225bb85f0b3'::uuid,'25 Bach Van, Phuong 2, Quan 5, Thanh Pho Ho Chi Minh','2026-03-21 23:10:42.236273','trandinhkhanhdu2@gmail.com','Dư','Trần','$2a$12$D0qbgWguH65b.sSTt.qhZug.shNUbfTzaJvONGMM2xlRYAC5Sh2O2','0944444444','ACTIVATED','2026-03-21 23:10:42.236273','0944444444'),
	 ('ff13e7fd-b1a1-4d41-8c89-0c6d8159b4a3'::uuid,'New staff''s address','2026-03-24 18:39:20.213681','newstaff@gmail.com','Staff','New','$2a$12$EUSESCYJz4Bp5jQMAT/HzuVerSlbj8293WLbFiGnAuSdVUT4gLuGq','0955555555','ACTIVATED','2026-03-24 18:39:20.213681','0955555555');
