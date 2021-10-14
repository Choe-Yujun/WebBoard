# Web

Database

create table BOARD (

	boardid smallint(5),

	postnum bigint(20) not null primary key,

	auto_increment,

	uid varchar(50),

	title varchar(150),

	description text,

	updtime datetime DEFAULT now(),

	temp bool not null default false,

	modtime datetime

);


create table user (

	uid int not null primary key auto_increment,

	email varchar(50) not null unique,

	name varchar(50) not null unique,

	pw varchar(50) not null

);


create table comments (

	cid bigint not null primary key auto_increment,

	postnum bigint not null,

	name varchar(50),

	description varchar(300),

	parent int,

	children varchar(500),

	updtime datetime default now(),

	modtime datetime,

	isDeleted bool not null default false

);

alter table comments add foreign key(postnum) references BOARD(postnum) on update cascade on delete cascade;


alter table BOARD add foreign key(uid) references user(name) on update cascade;


alter table [tablename] character set utf8 collate utf8_bin;