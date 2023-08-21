features for credit card :-
currently work in progress feature added code for it :=>
transaction csv and overall json details object

new feature we want to introducce is

1. the emi and active loan information
2. actual and transactional deviation

detailed features :-

1. the emi and active loan information :-
   this whole info has following fields in csv

- there will be menu that will appear after the 1st of the month till the 10 th of the month
  during this period there is also a way to update the existing tenures
- there will be model which will store basic details

1. there is main object model:-
   Loan :-
   i. loan id : string
   ii. loan name : string
   iii. laon source : emi on website or anything else : string
   iv. loan bearer : who has taken the loan : string
   v. ammount of loan : total ammount of loan : number
   vi. interest of loan : total interest on loan : number
   vii. remaining ammount of loan : remaining ammount to be aid : number
   viii. paid ammount of loan : total paid ammount of the loan : number
   ix. no of tenures : total no of tenures : number
   x. last tenure details : last tenure month and year details
   xi. list of tenures : this will contains array of tenure object : tenure[];
   xii. status of loan : status of the loan
2. tenure object :-
   i. no of tenure : number
   ii. tenure month and year : string
   iii. ammount of the tenure : number
   iv. interest on the tenure : number
   v. status of the tenure : number
   vi. additional remarks : string

real features in patch version 2
technical features :-

1. adding credit card module
   with loan measuring system
   1.1 this should take the multiple cards details
2. save the csv's based on month data all with existing and new
3. add one extra field as timestamp in the expense tracker csv
4. add the resources folder creation before turning the app on (will work on this last)
5. add functionality to save the tenure one by one directly not a single and add the modification for it after saving it

details come in handy

1. needs to create loan status object for cosnstants
   which has three params :- active , closed
2. need to have an pattern to save the files and also the loan period or tenure period details in the following format
   "month-year"
