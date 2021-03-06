//mysql module
var express = require('express');
var router = express.Router();
var connection = require('./myMysql');

router.post('/', function(req, res, next) {

    // console.log(req.body.id);
    var student_id = req.body.id;
    console.log(`${student_id}님이 makepage로 이동하셨습니다.`);
    connection.query(`SELECT DISTINCT ttname, ttrank, total_credit FROM user WHERE student_id=${student_id} AND ttrank IS NOT NULL ORDER BY ttrank ASC`, function(err, results, fields) {
        if (err) console.log(err);
        res.send(results);
    });

    // connection.end();
});

router.post('/modify_list', function(req, res, next) {
    var code = '';
    for(var i = 0; i < req.body.code.length; i++){
        code += `code='${req.body.code[i]}'`
        if(i != req.body.code.length - 1) code += ' or '
    }
    var modify_query = `SELECT name, code, time, credit, gubun, professor, english FROM courses WHERE ${code};`;
    // console.log(modify_query);
    connection.query(modify_query, function (err, result) {
            res.send(result);
    });

    // connection.end();
});

//make page 초기에 즐겨찾기 리스트 생성
//input : student_id
//output : list of object(name, code, time, credit, gubun, professor, english)

//과목명말고 다른 정보는 어떻게 가져올건가요?
router.post('/fav_list', function(req, res) {
    var student_id = req.body.student_id;
    var object_list = [];

    connection.query(`SELECT code FROM user WHERE student_id=${student_id} and favorited= TRUE;`, function (err, code_list) {
        if(err) console.log(err);

        for(var i in code_list) {
            connection.query(`SELECT name, code, time, credit, gubun, professor, english FROM courses WHERE code='${code_list[i].code}';`, function (err, result) {
                if(err) console.log(err);
                object_list.push(result[0]);
                
                if(object_list[code_list.length - 1] !== undefined) res.send(object_list);
            });
        }
    });
});

//이름으로 검색시
//input : course_name
//output : list of object(name, code, time, credit, gubun, professor, english)
router.post('/search/name', function(req, res, next) {
    // console.log(req.body.course_name);
    var search_by_name = `SELECT name, code, time, credit, gubun, professor, english FROM courses WHERE name like '%${req.body.course_name}%' OR professor like '%${req.body.course_name}%';`;
    connection.query(search_by_name, function(err, courseList, fields) {
        if(err) console.log(err);
        // console.log(courseList);
        res.send(courseList);
    });
});

//필터로 검색시
//input : course_name
//output : list of object(hakbu, gubun, gyoyang, credit, english, professor, time)

//타임은 어떻게할지 고민해봐야함
router.post('/search/filter', function(req, res, next) {
    var hakbu = req.body.hakbu;
    var gubun = req.body.gubun;
    var gyoyang = req.body.gyoyang;
    var credit = req.body.credit;
    var time = req.body.time;
    var english = req.body.english;
    var professor = req.body.professor;

    var credit_query = '';
    var time_query = '';

    if(credit.length != 0){
        credit_query += ' and (';
    }
    for(var i = 0 ; i < credit.length; i++){
        var credit_each = '';
        // console.log(`credit ${i}`);
        if(credit[i] === true){
            if(i === 0) credit_each = '.5';
            else if(i === 1) credit_each = '1';
            else if(i === 2) credit_each = '2';
            else if(i === 3) credit_each = '3';
            else if(i === 4) credit_each = '4';
            credit_query += `credit like '%${credit_each}%' `;
            if(i != credit.length -1) credit_query += 'or ';
        }
    }

    if(credit.length != 0){
        credit_query += ')';
    }
    
    if(time.length != 0){
        time_query += ' and (';
    }
    for(var i = 0 ; i < time.length; i++){
        // console.log(`time ${i}`);
        time_query += `time like '%${time[i]},%' or time like '%${time[i]}' `;
        if(i != time.length -1) time_query += 'or ';
    }

    if(time.length != 0){
        time_query += ')';
    }

    
    // and time like '%${time}%'
    // and credit like '%${credit}%'
    


    // //debugging용
    var search =`SELECT name, code, time, credit, gubun, professor, english FROM courses WHERE hakbu like '%${hakbu}%' and gubun like '%${gubun}%' and gyoyang like '%${gyoyang}%' and english like '%${english}%' and professor like '%${professor}%'${credit_query}${time_query}`;
 
    // console.log(search);
    connection.query(search, function(err, courseList, fields) {
        if(err) console.log(err);
        // console.log(courseList);
        res.send(courseList);
    });
});

//즐겨찾기추가
//input : student_id, code, course_name, professor, time, credit
//output : NULL
router.post('/add_fav', function(req, res, next) {
    var student_id = req.body.student_id;
    var code = req.body.code;
    var course_name = req.body.course_name;
    var professor = req.body.professor;
    var time = req.body.time;
    var credit = req.body.credit; 
    
    var add_fav = `INSERT INTO user(student_id, code, course_name, professor, time, credit, favorited) VALUES (${student_id}, '${code}', '${course_name}', '${professor}', '${time}', ${credit}, true);`
    // console.log(add_fav);
    connection.query(add_fav, function(err, result, fields) {
        if(err) console.log(err);
    });
});

//즐겨찾기삭제
//input : code, student_id
//output : 
router.post('/del_fav', function(req, res) {
    var student_id = req.body.student_id;
    var code = req.body.code;
    // console.log(student_id);
    // console.log(code);
    var _delete = `DELETE FROM user WHERE code = '${code}' and student_id = '${student_id}' and favorited = TRUE;`;
    // var _delete = `DELETE FROM user WHERE code = '%${req.body.code}%' and student_id = '${req.body.user}' and favorited = TRUE;`;
    connection.query(_delete, function(err, courseList, fields) {
        if(err) console.log(err);
        // console.log(courseList);
        // res.send(courseList);
    });
});

//즐겨찾기전체삭제
//input : student_id
//output : 
router.post('/del_all_fav', function(req, res) {
    var student_id = req.body.student_id;
    var delete_all = `DELETE FROM user WHERE student_id = '${student_id}' and favorited = TRUE;`;
    // var delete_all = `DELETE FROM user WHERE student_id = '${req.body.student_id}' and favorited = TRUE;`;
    connection.query(delete_all, function(err, courseList, fields) {
        if(err) console.log(err);
        // console.log(courseList);
        // res.send(courseList);
    });
});

//시간표생성
//input : array of data(student_id, ttname, total_credit, code, name, professor, time, credit)
router.post('/make_tt', function(req, res) {
    //디버깅용
    var student_id = req.body.student_id;

    var ttname = req.body.ttname;
    var total_credit = req.body.total_credit;
    var data_list = req.body.data_list; // code, name, professor, time, credit
    
    console.log(`${student_id}님이 '${ttname}'의 시간표를 생성하셨습니다.`);    

    // for(var i = 0 ; i < body.length; i++){
    //     var make_tt = `INSERT INTO user values(NULL, ${body[i].student_id}, '${body[i].ttname}', NULL, '${body[i].total_credit}', '${body[i].code}', '${body[i].course_name}', '${body[i].professor}', '${body[i].time}', ${body[i].credit}, false);`
    //     connection.query(make_tt, function(err, courseList, fields) {
    //         if(err) console.log(err);
    //         console.log(courseList);
    //         // res.send(courseList);
    //     });
    // }

    //실제용
    for (var i in data_list) {


        var make_tt = `INSERT INTO user(student_id, ttname, total_credit, code, course_name, professor, time, credit, height, start, size, k_start, color, day) VALUES (${student_id}, '${ttname}', ${total_credit}, '${data_list[i].code}', '${data_list[i].course_name}', '${data_list[i].professor}', '${data_list[i].time}', ${data_list[i].credit}, ${data_list[i].height}, ${data_list[i].start}, ${data_list[i].size},  ${data_list[i].k_start}, '${data_list[i].color}', '${data_list[i].day}');`
        // console.log(make_tt);
        connection.query(make_tt, function(err, courseList, fields) {
            if(err) console.log(err);
            // console.log(courseList);
        });
    }
    res.send('add');
});

//다른시간표보기리스트생성(초기)
//input : student_id
//output : array of ttname 
router.get('/tt_list', function(req, res) {
    var student_id = 21500670;
    var search_tt = `select distinct ttname from user where student_id = ${student_id} and favorited = false;`;
    // var delete_all = `DELETE FROM user WHERE student_id = '${req.body.student_id}' and favorited = TRUE;`;
    connection.query(search_tt, function(err, courseList, fields) {
        if(err) console.log(err);
        // console.log(courseList);
        // res.send(courseList);
    });
    
});

//다른 시간표 보기
//input : student_id, ttname
//output : list of object(course_name, professor, time, credit)
router.get('/show_tt', function(req, res) {
    var student_id = 21500670; //req.body.id
    var ttname = ''; //req.body.ttname

    connection.query(`SELECT course_name, professor, time, credit FROM user WHERE student_id=${student_id} and ttname='${ttname}';`, function(err, results, fields) {
        if(err) console.log(err);
        // console.log(results);
        res.send(results);
    });
});

router.get('/update_time', function(req, res) {

    connection.query(`SELECT time FROM user WHERE ttname='update_time';`, function(err, results, fields) {
        if(err) console.log(err);
        // console.log(results);
        res.send(results);
    });
});

module.exports = router;
