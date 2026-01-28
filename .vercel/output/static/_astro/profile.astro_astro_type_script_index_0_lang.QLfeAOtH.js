import{s as t}from"./supabase.B9bYqD4q.js";import"./index.DR2MMlUt.js";const{data:{session:a}}=await t.auth.getSession(),o=localStorage.getItem("user_wallet");!a&&!o&&(window.location.href="/login");
