#set sign 
insert emmas.sign values ('ON'); 
insert emmas.sign values ('OFF');

#set rank
insert emmas.rank value('0');
insert emmas.rank value('1');
insert emmas.rank value('2');
insert emmas.rank value('3');
insert emmas.rank value('4');
insert emmas.rank value('-1');

#set type
insert emmas.type value('project');
insert emmas.type value('opertation');
insert emmas.type value('subscript');
insert emmas.type value('etc');

#set case
insert emmas.case value('registration');
insert emmas.case value('disposal');
insert emmas.case value('rent');
insert emmas.case value('return');
insert emmas.case value('start_use');
insert emmas.case value('end_of_use');
insert emmas.case value('management');

#set status

#set status eq
insert emmas.status value('management');
insert emmas.status value('available');
insert emmas.status value('unavail');
insert emmas.status value('in_use');
insert emmas.status value('lending');
insert emmas.status value('lost');
#set user status
insert emmas.status value('wating_ap');
insert emmas.status value('sanctioned');
insert emmas.status value('normal');

#eq add column categori
alter table emmas.equipment
add categori varchar(20);
alter table emmas.equipment
add name varchar(30);
#categori is equipment_type

#sample users
insert emmas.signin (ID,PW,sign) values ('test14','1234','OFF'); #암호화
insert emmas.user values ((select user_number from emmas.signin where ID='test14'),'정수연',0,'normal');
(select user_number from emmas.signin where ID='test10');
#암호화
insert emmas.signin (ID,PW,sign) values ('test13',HEX(AES_ENCRYPT('1234','zoo')),'OFF'); #암호화
#복호화
select AES_DECRYPT(UNHEX(PW),'zoo') from emmas.signin where user_number=15;

#sample equipments
insert into emmas.equipment values (1,'subscript',0,'in_use','2020-01-01','samsung','blank','CVML 연구실','가전제품','냉장고');
insert into emmas.equipment values (2,'subscript',0,'in_use','2020-01-01','LG','blank','CVML 연구실','가전제품','공기청정기');
insert into emmas.equipment values (3,'subscript',0,'in_use','2020-01-01','LG','blank','CVML 연구실','가전제품','청소기');
insert into emmas.equipment values (4,'etc',0,'in_use','2020-01-01','Magic','대여(렌탈) 상태','CVML 연구실','가전제품','정수기');
insert into emmas.equipment values (5,'etc',0,'in_use','2020-01-01','samsung','blank','CVML 연구실','가전제품','온풍기');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) values ('etc',0,'in_use','2020-01-01','samsung','blank','CVML 연구실','가전제품','전자레인지');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('etc',0,'in_use','2020-01-01','HYUNDAI','blank','CVML 연구실','가전제품','세절기');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('project',0,'available','2020-01-01','HP','IP:220.68.27.132','CVML 연구실','가전제품','HP-흑백 프린터');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','ASUS','IP:220.68.27.123','CVML 연구실','computer','Desktop1');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','ATEC','IP:220.68.27.125','CVML 연구실','computer','Desktop2');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','ASUS','IP:220.68.27.122','CVML 연구실','computer','Desktop3');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','MCOM','IP:220.68.27.133','CVML 연구실','computer','Desktop4');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.129','CVML 연구실','computer','Desktop5');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.127','CVML 연구실','computer','Desktop6');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.134','CVML 연구실','computer','Desktop7');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.150','CVML 연구실','computer','Desktop8');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-04-18','ASUS','IP:220.68.27.136','CVML 연구실','computer','Desktop9');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.128','CVML 연구실','computer','Server1');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'in_use','2018-01-01','T1LS','IP:220.68.27.124','CVML 연구실','computer','Server2');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2017-01-01','T1LS','IP:220.68.27.126','CVML 연구실','computer','Server3');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.124, GPU:1080ti*2','CVML 연구실','computer','Server4');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-01-01','T1LS','IP:220.68.27.130, GPU:Titanx*4','서버실(151-225)','computer','Server5');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'available','2020-04-18','G1','IP:220.68.27.130, GPU:RTX2080Ti*2','서버실(151-225)','computer','Server6');
insert into emmas.equipment (eq_type,eq_RANK,eq_status,acquisition,manufacturer,note,location,categori,eq_name) 
values ('opertation',0,'in_use','2020-06-03','Super','IP:220.68.27.255, 로그파일 기록용','CVML 연구실','computer','Test_Se_LOG');

#sample log
insert into emmas.log (log_date, user_user_number,equipment_eq_number, log_case, log_file)
values ('2020-06-15', 5, 9, 'management', 'log_test5.log');

#sample req_board
insert into emmas.req_board (id_board,title,descript,edit_date,user_number,response_id)
values (1,'사용 불가능한 ID','ID가 사용불가능하다고 나옵니다.','2020-06-05',1,null);
insert into emmas.req_board (id_board,title,descript,edit_date,user_number,response_id)
values (2,'220 서버 확인 부탁드립니다.','220 서버가 다운되었습니다. 확인 해주세요.','2020-06-06',8,null);
insert into emmas.req_board (id_board,title,descript,edit_date,user_number,response_id)
values (3,'테스트 중입니다.','테스트를 하고자 합니다.','2020-06-07',4,null);
insert into emmas.req_board (id_board,title,descript,edit_date,user_number,response_id)
values (4,'테스트 중입니다:re.','테스트를 하고자 합니다. \n 답변:테스트 완료했습니다. 01024891495','2020-06-07',1,1);


SELECT * FROM emmas.log where equipment_eq_number=10 order by log_date desc limit 5;

#update status
update emmas.user set status='sanctioned' where userName='김주찬';