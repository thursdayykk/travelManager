<template>
    <div>
        <router-link :to="{name:'userDetail',param:{id:1}}">user</router-link>
        <router-link :to="{name:'hotelDetail',param:{id:2}}">hotel</router-link>
        <router-link :to="{name:'blogDetail',param:{id:3}}">blog</router-link>
        <router-link :to="{name:'storeDetail',param:{id:4}}">store</router-link>
        
        <router-view></router-view>
    </div>
</template>
