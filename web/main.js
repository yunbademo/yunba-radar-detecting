var APPKEY = '56a0a88c4407a3cd028ac2fe';
var TOPIC_REPORT = 'radar_detecting';

$(window).bind("beforeunload", function() {
    yunba.unsubscribe({ 'topic': TOPIC_REPORT }, function(success, msg) {
        if (!success) {
            console.log(msg);
        }
    });
})

$(document).ready(function() {
    window.send_time = null;
    window.first_msg = true;

    $('#span-status').text('正在连接云巴服务器...');
    center = { lat: 22.542955, lng: 114.059688 };

    window.yunba = new Yunba({
        server: 'sock.yunba.io',
        port: 3000,
        appkey: APPKEY
    });

    // 初始化云巴 SDK
    yunba.init(function(success) {
        if (success) {
            var cid = Math.random().toString().substr(2);
            console.log('cid: ' + cid);
            window.alias = cid;

            // 连接云巴服务器
            yunba.connect_by_customid(cid,
                function(success, msg, sessionid) {
                    if (success) {
                        console.log('sessionid：' + sessionid);

                        // 设置收到信息回调函数
                        yunba.set_message_cb(yunba_msg_cb);
                        // TOPIC
                        yunba.subscribe({
                                'topic': TOPIC_REPORT
                            },
                            function(success, msg) {
                                if (success) {
                                    console.log('subscribed');
                                    yunba_sub_ok();
                                } else {
                                    console.log(msg);
                                }
                            }
                        );
                    } else {
                        console.log(msg);
                    }
                });
        } else {
            console.log('yunba init failed');
        }
    });
});

function yunba_msg_cb(data) {
    console.log(data);
    if (data.topic != TOPIC_REPORT) {
        return;
    }

    var msg = JSON.parse(data.msg);
    $('#span-loading').css("display", "none");
    $('#span-status').text('探测到次数: ' + msg.reset);
}

function yunba_sub_ok() {
    $('#span-status').text('正在等待上报...');
}
