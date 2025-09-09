(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  
  (func $multiply (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)
  
  (func $factorial (param $n i32) (result i32)
    (local $result i32)
    (local $counter i32)
    i32.const 1
    local.set $result
    i32.const 2
    local.set $counter
    
    (block $exit
      (loop $loop
        local.get $counter
        local.get $n
        i32.gt_s
        br_if $exit
        
        local.get $result
        local.get $counter
        i32.mul
        local.set $result
        
        local.get $counter
        i32.const 1
        i32.add
        local.set $counter
        
        br $loop
      )
    )
    
    local.get $result)
  
  (export "add" (func $add))
  (export "multiply" (func $multiply))
  (export "factorial" (func $factorial))
)
