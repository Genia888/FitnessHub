-- admin 
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae5972f','Sebastien','Salgues','sebastien.salgues@gmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',1,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',0,0,0,'23 Avenue Hippolyte de Barrau','','12000','Rodez','Allergique aux pollens','Pas trop dur !','','','',0.0,0.0,'');

-- coach
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59721','Sebastien','Salgues','sebastien.salgues@hotmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',1,1,0,'23 Avenue Hippolyte de Barrau','','12000','Rodez','','','',"8 ans d'experience",'Expert en musculation',0.0,0.0,'http://localhost:5500/public/images/ready/coach2.jpg');

-- coach
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59722','Elhadj','Reziga','seba15@laposte.net','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',1,1,0,'23 Avenue Hippolyte de Barrau','','12000','Rodez','','','',"5 ans d'experience",'Spécialiste Fitness & Nutrition',0.0,0.0,'http://localhost:5500/public/images/ready/coach1.jpg');

-- coach sans nutrition
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59723','Sarah','Reziga','sebastien.salgues@hotmail2.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',1,0,0,'23 Avenue Hippolyte de Barrau','','12000','Rodez','','','',"20 ans d'experience",'Expert en musculation',0.0,0.0,'http://localhost:5500/public/images/ready/coach3.jpg');

-- User
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59724','Hedjouj','Reziga','hedjouj@hotmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',0,0,1,'23 Avenue Hippolyte de Barrau','','12000','Rodez','Régime sans pate !','Objectif ressembler a shwarzi','',"",'',0.0,0.0,'http://localhost:5500/public/images/ready/client1.jpg');

-- User
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59725','Yves','Dupond','Yves@hotmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',0,0,1,'23 Avenue Hippolyte de Barrau','','12000','Rodez','Courrir un marathon','Aucun','',"",'',0.0,0.0,'http://localhost:5500/public/images/ready/client2.jpg');

-- User
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59726','Marc','Dupond','Marc@hotmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',0,0,1,'23 Avenue Hippolyte de Barrau','','12000','Rodez','Se remuscler','Prendre 20 kg de muscle','',"",'',0.0,0.0,'http://localhost:5500/public/images/ready/client3.jpg');

-- User
insert into User( id,first_name,last_name,email,password,is_admin,created_at,updated_at,is_coach,is_nutrition,is_subscribe,adress1,adress2,postal_code,city,allergy_comment,physical_constraint,coach_certif,coach_experience,coach_description,size,weight, picture )
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59727','Antoine','Dupond','Antoine@hotmail.com','$2b$12$IP8V6xpG6apEbpoi4ACze.ucWwOx8wqx1CUFuBD27AvJOXGp7QJFi',0,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',0,0,1,'23 Avenue Hippolyte de Barrau','','12000','Rodez','Se remuscler','Prendre 20 kg de muscle','',"",'',0.0,0.0,'http://localhost:5500/public/images/ready/client3.jpg');

-- articles de la boutique
insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000001', 'T-shirt FitnessHub', 'T-shirt FitnessHub',
'http://localhost:5500/public/images/ready/product1.jpg','','',25,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000002', 'Shaker FitnessHub', 'Shaker FitnessHub',
'http://localhost:5500/public/images/ready/product2.jpg','','',15,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000003', 'Casquette FitnessHub', 'Casquette FitnessHub',
'http://localhost:5500/public/images/ready/product3.jpg','','',19,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000004', 'Whey Protéine', 'Whey Protéine',
'http://localhost:5500/public/images/ready/product4.jpg','','',30,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000005', 'Gant FitnessHub', 'Gant FitnessHub',
'http://localhost:5500/public/images/ready/product5.jpg','','',15,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000006', 'Gourde FitnessHub', 'Gourde FitnessHub',
'http://localhost:5500/public/images/ready/product2.jpg','','',20,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000007', 'Bob FitnessHub', 'Bob FitnessHub',
'http://localhost:5500/public/images/ready/product7.jpg','','',25,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000008', 'Chaussettes FitnessHub', 'Chaussettes FitnessHub',
'http://localhost:5500/public/images/ready/product8.jpg','','',20,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

insert into "Product_shop" ("id", "name", "description", 
    "picture", "picture2", "picture3",
    "price", "created_at", "updated_at",
    "is_active", "is_in_stock")
values ('000000000000000000000000000000000009', 'Leggings FitnessHub', 'Leggings FitnessHub',
'http://localhost:5500/public/images/ready/product9.jpg','','',45,'2025-09-15 17:05:36.374418','2025-09-15 17:05:36.374432',true, true);

--
-- message for one user by one coach
-- user : 'Marc','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into "Message"( id, is_read, text, user_id, coach_id, is_from_user, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59001', 1, "Coucou, ça c'est bien passé ta séance ", '83726b63-dcd3-4f7e-bc36-0f326ae59726', '83726b63-dcd3-4f7e-bc36-0f326ae59721', 0, '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- message for one user by one coach
-- user : 'Marc','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into "Message"( id, is_read, text, user_id, coach_id, is_from_user, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59002', 1, "Oui, ça va, j'ai mis moins de temps que d'habitude ", '83726b63-dcd3-4f7e-bc36-0f326ae59726', '83726b63-dcd3-4f7e-bc36-0f326ae59721', 1, '2025-09-15 17:05:37.374418', '2025-09-15 17:05:36.374418');

--
-- message for one user by one coach
-- user : 'Marc','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into "Message"( id, is_read, text, user_id, coach_id, is_from_user, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59003', 1, "Cool on change rien pour demain ", '83726b63-dcd3-4f7e-bc36-0f326ae59726', '83726b63-dcd3-4f7e-bc36-0f326ae59721', 0, '2025-09-15 17:05:38.374418', '2025-09-15 17:05:36.374418');

--
-- message for one user by one coach
-- user : 'Marc','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into "Message"( id, is_read, text, user_id, coach_id, is_from_user, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59004', 0, "Ok ", '83726b63-dcd3-4f7e-bc36-0f326ae59726', '83726b63-dcd3-4f7e-bc36-0f326ae59721', 0, '2025-09-15 17:05:39.374418', '2025-09-15 17:05:39.374418');

--
-- subscription for one user by one coach
-- user : 'Marc','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into Subscription (id, begin_date, end_date, option_nutrition, option_message, user_id, coach_id, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59001', '2025-01-01', '2025-12-31', 1 , 1, '83726b63-dcd3-4f7e-bc36-0f326ae59726', '83726b63-dcd3-4f7e-bc36-0f326ae59721', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- subscription for one user by one coach
-- user : 'Yves','Dupond'
-- coach : 'Sebastien','Salgues'
--
insert into Subscription (id, begin_date, end_date, option_nutrition, option_message, user_id, coach_id, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59002', '2025-01-01', '2025-06-30', 1 , 1, '83726b63-dcd3-4f7e-bc36-0f326ae59725', '83726b63-dcd3-4f7e-bc36-0f326ae59721', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- subscription for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
--
insert into Subscription (id, begin_date, end_date, option_nutrition, option_message, user_id, coach_id, created_at, updated_at)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59003', '2025-01-01', '2025-12-31', 1 , 1, '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Nutrition for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
--
insert into "Nutrition_schedule" ("id", "description",
    "picture", "category", "calories",
    "quantity", "date_nutrition", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59003', "Oats + Fruits + Yogurt", "http://localhost:5500/public/images/ready/client1.jpg", "Breakfast", 10,10,'2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Nutrition for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
--
insert into "Nutrition_schedule" ("id", "description",
    "picture", "category", "calories",
    "quantity", "date_nutrition", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59004', "Quinoa Salad + Chicken", "http://localhost:5500/public/images/ready/client1.jpg", "Lunch", 10,10,'2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Nutrition for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
--
insert into "Nutrition_schedule" ("id", "description",
    "picture", "category", "calories",
    "quantity", "date_nutrition", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59005', "Almonds + Apple", "http://localhost:5500/public/images/ready/client1.jpg", "Snack", 10,10,'2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Nutrition for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
-- 
insert into "Nutrition_schedule" ("id", "description",
    "picture", "category", "calories",
    "quantity", "date_nutrition", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59006', "Salmon + Steamed Vegetables", "http://localhost:5500/public/images/ready/client1.jpg", "Dinner", 10,10,'2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create work out for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
-- 
insert into "Workout_schedule" ("id", "description",
    "picture", "category", "time",
    "comment", "date_workout", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59007', "3x15 repetitions", "http://localhost:5500/public/images/ready/client1.jpg", "Squats", 0,'Trop dur !','2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create work out for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
-- 
insert into "Workout_schedule" ("id", "description",
    "picture", "category", "time",
    "comment", "date_workout", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59008', "3x10 repetitions", "http://localhost:5500/public/images/ready/client1.jpg", "Push-ups", 0,'Trop dur !','2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create work out for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
-- 
insert into "Workout_schedule" ("id", "description",
    "picture", "category", "time",
    "comment", "date_workout", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59009', "3x30 secondes", "http://localhost:5500/public/images/ready/client1.jpg", "Pull over", 0,'Trop dur !','2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create work out for one user by one coach
-- user : Hedjouj
-- coach : Elhadj
-- 
insert into "Workout_schedule" ("id", "description",
    "picture", "category", "time",
    "comment", "date_workout", 
    "user_id", "coach_id", "created_at",
    "updated_at"
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59006', "20 minutes", "http://localhost:5500/public/images/ready/client1.jpg", "Cardio", 20,'Trop dur !','2025-09-15 17:05:36', '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create Review
-- 
insert into "Review" (
    "id" , "text" , "rating" , "user_id" ,
    "coach_id" , "created_at" , "updated_at" 
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59010', "Très bon coach", 5 , '83726b63-dcd3-4f7e-bc36-0f326ae59724', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');

--
-- Create Review
-- 
insert into "Review" (
    "id" , "text" , "rating" , "user_id" ,
    "coach_id" , "created_at" , "updated_at" 
)
values ( '83726b63-dcd3-4f7e-bc36-0f326ae59011', "Moyen", 3 , '83726b63-dcd3-4f7e-bc36-0f326ae59727', '83726b63-dcd3-4f7e-bc36-0f326ae59722', '2025-09-15 17:05:36.374418', '2025-09-15 17:05:36.374418');