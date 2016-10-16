
var net = require('net');
var fs = require('fs');
var spawn = require('child_process').spawn;
  
// 创建一个TCP服务器实例，调用listen函数开始监听指定端口  
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数  
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的  

save_imagename = 'target_mask.jpeg';
preout_imagename = 'out.png';
current_path = '/home/ubuntu/fast-neural-doodle/';
function imageProcess () {
if(true){
var prestyle_filepath = 'data/Monet/';
function choose_prestyle_file(prestyle_choice){
    if(prestyle_choice == 1){
        prestyle_filepath = 'data/Monet/';
    }else if(prestyle_choice == 2){
        prestyle_filepath = 'data/Renoir/';
    }else if(prestyle_choice == 3){
        prestyle_filepath = 'data/Vango/';
    }
}
var neuralstyle_modelpath = 'models/fire.model';
function choose_neuralstyle_file(neuralstyle_choice){
    if(neuralstyle_choice == 1){
        neuralstyle_modelpath = 'models/fire.model';
    }else if(neuralstyle_choice == 2){
        neuralstyle_modelpath = 'models/ice.model';
    }else if(neuralstyle_choice == 3){
        neuralstyle_modelpath = 'models/candy_512_2_49000.model';
    }
}
choose_prestyle_file(3);
choose_neuralstyle_file(1);
prestyle_mask_filepath = prestyle_filepath + 'style_mask.png';
prestyle_img_filepath = prestyle_filepath + 'style.png';
target_mask_filepath = 'data/target/' + save_imagename;


//python get_mask_hdf5.py --n_colors=4 --style_image=data/Renoir/style.png --style_mask=data/Renoir/style_mask.png --target_mask=data/Renoir/target_mask.png
const generate = spawn('python',['get_mask_hdf5.py','--n_colors=4',
    '--style_image='+current_path+prestyle_img_filepath,
    '--style_mask='+current_path+prestyle_mask_filepath,
    '--target_mask='+current_path+target_mask_filepath]);

generate.stdout.on('data', (data) => {
    console.log(`${data}`);
});
generate.stderr.on('data', (data) => {
    console.log(`${data}`);
});
generate.on('close', (code) => {
    //th fast_neural_doodle.lua -masks_hdf5 masks.hdf5 -gpu -1
    const train = spawn('th',['fast_neural_doodle.lua','-masks_hdf5','masks.hdf5']);
    train.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    train.stderr.on('data', (data) => {
        console.log(`${data}`);
    });
    train.on('close', (code) => {
        console.log(`${code}`);
        neuralstyle_root_path = '/home/ubuntu/chainer-fast-neuralstyle/'
        //python generate.py images/test.png  -m models/fire.model -o images/test_out.jpg
        const neuralstyle = spawn('python',[neuralstyle_root_path+'generate.py'
            ,current_path+preout_imagename,'-m'
            ,neuralstyle_root_path+neuralstyle_modelpath,'-o'
            ,current_path+'output.jpg']);
        neuralstyle.stdout.on('data', (data) => {
            console.log(`${data}`);
        });
        neuralstyle.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

    });
});
}
}

exports.imageProcess = imageProcess;
