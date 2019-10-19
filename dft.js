function dft(x) {

    let X = [];

    const N = x.length;

    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < N; n++) {

            let phi = TWO_PI * k * n / N;

            re += x[n] * cos(phi);
            im += x[n] * sin(phi) * -1;


        }
        re = re / N;
        im = im / N;

        X[k] = {
            re: re,
            im: im, 
            amp: Math.sqrt(re*re+im*im),
            phase: Math.atan2(im,re),
            freq: k
        };


    }

    return X;
}