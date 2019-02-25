DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
 
CREATE TABLE products (
	product_id INT NOT NULL auto_increment,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL (10,4),
    stock_quantity INT(255),
    PRIMARY KEY (product_id)
    );
     
    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Wilson Baseball", "Sporting Equipment", 9.49, 999),
		   ("AJAX Ice Scraper", "Household Goods", 13.25, 125),
           ("New Balance Turf Shose", "Apparel", 99.99, 293),
           ("Spalding Offical NBA Basketball", "Sporting Equipment", 59.49, 101),
           ("Wilson Offical NFL Football", "Sporting Equipment", 99.83, 108),
           ("Wilson A2000 Infielder's Glove", "Sporting Equipment", 249.88, 233),
           ("HP Computer", "Electronics", 649.88, 119),
           ("Apple Ipad", "Electronics", 599.96, 96),
           ("Autographed Salvador Perez Baseball", "Sports Memorabilia", 345.83, 19),
           ("Autographed Patrick Mahomes Football", "Sports Memorabilia", 299.99, 21);
           
	SELECT * FROM products;
           