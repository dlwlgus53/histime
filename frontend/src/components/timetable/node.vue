<template>
<div>
    <div v-if="data.height!=-1">
        <div class ="box">
            <!-- 노드 -->
            <div v-bind:id="height" v-bind:class="classObject()" v-bind:style="{ 'background-color': `${mycolor}`}" class = "node" >
                <!-- <input type = "color" v-model="mycolor" /> -->
                <input type="button" id="col" value="c" v-on:click="show"/>
                  <div v-show="showbox" class="placeholder-box" > 
                  <p>color choose</p>
                  
                  </div>
                <!-- <p id = "code" >{{`[${this.data.code}]`}}</p> -->
                <button  id = "del" v-on:click="(event) => { this.remove() }" >x</button>
                <p id="course_name">{{ this.data.course_name }}</p>
                <p id="credit">{{ this.data.credit }}학점</p>
                <p id="prof">{{ this.data.professor}}</p> 

            </div>
            <!-- 툴팁 박스 -->
            <div v-if="data.day != 6">
                <span v-bind:style="{ 'background-color': `${mycolor}`}" v-bind:class="classObjectTip()" class = "tooltip">
                <p id="title">상세정보</p>
                <p>{{ this.data.code }}</p> 
                <p>{{ this.data.course_name }}</p>
                <p>{{ this.data.professor }}</p>
                <p>{{ this.data.time }}</p>
                <p>{{ this.data.credit }}학점</p>
                <p>영어 : {{ this.data.english }} &nbsp; {{ this.data.gubun }}</p>
            </span>
            </div>
            <!-- 토요일 툴팁 박스 -->
            <div v-else>
                <span v-bind:style="{ 'background-color': `${mycolor}`}" v-bind:class="classObjectTip()" class="tooltipsix">
                <p id="title">상세정보</p>
                <p>{{ this.data.code }}</p> 
                <p>{{ this.data.course_name }}</p>
                <p>{{ this.data.professor }}</p>
                <p>{{ this.data.time }}</p>
                <p>{{ this.data.credit }}학점</p>
                <p>영어 : {{ this.data.english }} &nbsp; {{ this.data.gubun }}</p>
            </span>
            </div>
            
           
        </div>
    </div>
</div>
    
</template>

<script>
export default {
   props : ['data'],//start, height, name, professor
   data(){
        return{
            showbox: false,
            time : [] , case : [], 
            height : 'height' + this.data.height , //연강
            mycolor : "",
        };
    },
    
    methods : {
        classObject() { //
            var start = this.data.k_start;//한 칸안에서 어디서 시작할지
            var size =this.data.size;//크기
             for(var i=0; i<6; i++)
                        this.case[i] = false;
            if(start == 0&& size ==1) this.case[0] = true;
            else if(start == 0&& size ==2)   this.case[1] = true;
            else if(start == 0&& size ==3)   this.case[2] = true;
            else if(start == 1&& size ==2)   this.case[3] = true;
            else if(start == 1&& size ==3)   this.case[4] = true;
            else if(start == 2&& size ==3)   this.case[5] = true;
            
            for(var i=0; i<10; i++)//몇고시인지
                this.time[i] = false;
            this.time[this.data.start-1] = true;
            // console.log("time" + this.time)            
            return {
                    t1: this.time[0],
                    t2: this.time[1],
                    t3: this.time[2],
                    t4: this.time[3],
                    t5: this.time[4],
                    t6: this.time[5],
                    t7: this.time[6],
                    t8: this.time[7],
                    t9: this.time[8],
                    t10: this.time[9],
                    t11: this.time[10],
                    case0 : this.case[0],
                    case1 : this.case[1],
                    case2 : this.case[2],
                    case3 : this.case[3],
                    case4 : this.case[4],
                    case5 : this.case[5]   
            }
        },
         classObjectTip() { //툴팁용 class bind
            for(var i=0; i<10; i++)//몇고시인지
                this.time[i] = false;
            this.time[this.data.start-1] = true;      
            return {
                    t1: this.time[0],
                    t2: this.time[1],
                    t3: this.time[2],
                    t4: this.time[3],
                    t5: this.time[4],
                    t6: this.time[5],
                    t7: this.time[6],
                    t8: this.time[7],
                    t9: this.time[8],
                    t10: this.time[9],
                    t11: this.time[10],
            }
        },
        remove() {
            for(var i = 0; i < this.$parent.color_list.length; i++) {
                if (this.mycolor === this.$parent.color_list[i]) {
                    this.$parent.color_list.splice(i, 1);
                    this.$parent.color_list.push(this.mycolor);
                }
            }
            this.$parent.color_index--;
            this.$parent.remove(this.data.code);
        },
        show: function(){
        this.showbox=!this.showbox;
        }
    },
  
     created(){
        this.mycolor = this.data.color;

        // console.log(color);

        // $(this).css('background-color', 'red');

        //     var div = document.querySelector('#node').style;
        //      this.mycolor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        //      div.backgroundColor = this.mycolor;
     },
     watch:{
         tooltip :{
             handler(){
                // console.log(this.tooltip)
             }
            
         }
     },
    computed: {
        
    }
}

       

</script>

<style src = '../../assets/timetable/node.scss' lang='scss' scoped>
   
</style>