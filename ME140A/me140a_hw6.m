% solve x'' = -sin(x) - 0.1x', with boundary conditions x(0) = 5 and
% x(10)=6.


%Run algorithm with 100 points and 40 sweeps
npts = 100;
x_arr_40 = iterative(0, 1, npts, 40);
%Compare with 100 sweeps
x_arr_100 = iterative(0, 1, npts, 100);
%Compare with 1000 sweeps
x_arr_1k = iterative(0, 1, npts, 1000);
%Compare with 2000 sweeps
x_arr_2k = iterative(0, 1, npts, 2000);
%Compare with 4000 sweeps
x_arr_4k = iterative(0, 1, npts, 4000);

clf
hold on
plot(x_arr_40)
plot(x_arr_100)
plot(x_arr_1k)
plot(x_arr_2k)
plot(x_arr_4k)
legend('40','100','1k','2k','4k')
hold off

%Iterative solver. Takes number of points to discretize with, and a number
%of passes to do.
function x_arr = iterative(x0, x10, npts, npasses)

    %Array of x and x' values
    dt = 10/npts;
    x_arr = zeros(1,npts);
    xp_arr = zeros(1,npts); %xp for "x prime"

    %Set boundary values
    x_arr(1) = x0;
    x_arr(end) = x10;

    %do a number of passes
    for i_pass = 1:npasses
        %step through each point and update x_arr.
        %would be 1:npts, but we skip the endpoints, so just 2:npts-1.

        for ix = 2:npts-1
            %x[i-1], x[i], x[i+1]
            xi0 = x_arr(ix - 1);
            xi1 = x_arr(ix);
            xi2 = x_arr(ix + 1);
            %x'[i]
            xpi = xp_arr(ix);

            newxval = (1/2)*(xi0 + xi2 - dt*dt*(-sin(xi1)-0.1*xpi));
            x_arr(ix) = newxval;
        end
        
        %step through an update the derivative estimates using a forward
        %difference rule, x'[i] = (x[i+1]-x[i])/dt. This prevents us from
        %updating the last point though, so that one we use we
        %(x[i]-x[i-1])/dt instead.

        for ix = 1:npts-1 %skip last point
            %x[i], x[i+1]
            xi1 = x_arr(ix);
            xi2 = x_arr(ix + 1);

            xprime_val = (xi2 - xi1)/dt;
            xp_arr(ix) = xprime_val;
        end
        %last point ends up getting same value as previous one
        xp_arr(end) = xp_arr(end-1);
    end
end
